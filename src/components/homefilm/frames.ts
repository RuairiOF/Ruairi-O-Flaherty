const BASE = import.meta.env.BASE_URL || '/'

/**
 * The film is stored at 48 frames a second: the 24 fps master plus one
 * interpolated frame between each pair. The timeline is written in 12 fps
 * "ticks", so one tick is four stored frames.
 */
export type FilmProfile = 'desktop' | 'mobile'
export const FRAME_COUNT = 1229
export const FRAMES_PER_TICK = 4

export const frameUrl = (profile: FilmProfile, i: number) =>
  `${BASE}film/v2/${profile === 'desktop' ? 'd' : 'm'}/f${String(i).padStart(4, '0')}.webp`

/** One still from the film at a timeline tick, for posters and the reduced-motion version. */
export const stillUrl = (tick: number, profile: FilmProfile = 'desktop') =>
  frameUrl(profile, Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(tick * FRAMES_PER_TICK))))

interface StoreOptions {
  /** Parallel downloads. */
  fetchConcurrency?: number
  /** Parallel decodes (each runs off the main thread). */
  decodeConcurrency?: number
  /** Decoded frames kept in memory. */
  cacheSize?: number
  /** Fetch the in-between frames as well as every other one. */
  fullRate?: boolean
}

const AHEAD = 40
const BEHIND = 10

/**
 * Downloads the film's frames and keeps a window of them decoded around the
 * reader, so drawing a frame never waits on a decode.
 *
 * Every other frame is fetched first, front to back, so the whole film can be
 * scrubbed at 24 fps early on; the in-between frames follow for 48 fps. Frames
 * just ahead of the reader always jump the queue. Decoding uses
 * createImageBitmap (off the main thread) and the least recently used bitmaps
 * outside the reader's window are released.
 */
export class FrameStore {
  readonly fullRate: boolean
  loadedCount = 0
  readonly wantedCount: number

  private readonly blobs: (Blob | null)[]
  private readonly status: Uint8Array // 0 waiting, 1 fetching, 2 loaded, 3 failed
  private readonly bitmaps: (ImageBitmap | null)[]
  private readonly decoding: Uint8Array
  private readonly lastUse: Float64Array
  private queue: number[] = []
  private fetching = 0
  private decodingCount = 0
  private cached = 0
  private clock = 0
  private focusAt = 0
  private focusDir = 1
  private stopped = false
  private readonly abort = new AbortController()
  private readonly fetchConcurrency: number
  private readonly decodeConcurrency: number
  private readonly cacheSize: number

  constructor(
    private readonly url: (i: number) => string,
    readonly count: number,
    private readonly onFrame: (i: number) => void,
    opts: StoreOptions = {},
  ) {
    this.fetchConcurrency = opts.fetchConcurrency ?? 8
    this.decodeConcurrency = opts.decodeConcurrency ?? 3
    this.cacheSize = opts.cacheSize ?? 72
    this.fullRate = opts.fullRate ?? true
    this.blobs = new Array(count).fill(null)
    this.bitmaps = new Array(count).fill(null)
    this.status = new Uint8Array(count)
    this.decoding = new Uint8Array(count)
    this.lastUse = new Float64Array(count)
    this.wantedCount = this.fullRate ? count : Math.ceil(count / 2)
  }

  start() {
    const order = [0]
    for (let i = 2; i < this.count; i += 2) order.push(i)
    if (this.fullRate) for (let i = 1; i < this.count; i += 2) order.push(i)
    this.queue = order
    this.pumpFetch()
  }

  stop() {
    this.stopped = true
    this.abort.abort()
    this.queue = []
    for (let i = 0; i < this.count; i++) {
      this.bitmaps[i]?.close()
      this.bitmaps[i] = null
    }
  }

  /** The reader is at frame i, moving in direction dir. */
  focus(i: number, dir: number) {
    const c = this.clamp(i)
    if (dir) this.focusDir = dir > 0 ? 1 : -1
    this.focusAt = c
    const urgent: number[] = []
    for (let d = 0; d <= 96; d++) {
      const j = c + d * this.focusDir
      if (this.wanted(j) && this.status[j] === 0) urgent.push(j)
    }
    for (let d = 1; d <= 16; d++) {
      const j = c - d * this.focusDir
      if (this.wanted(j) && this.status[j] === 0) urgent.push(j)
    }
    if (urgent.length) {
      const set = new Set(urgent)
      this.queue = [...urgent, ...this.queue.filter((j) => !set.has(j))]
    }
    this.pumpFetch()
    this.pumpDecode()
  }

  /** The decoded frame closest to i (the exact one when it is ready), or -1. */
  nearest(i: number, maxDist = 64): number {
    const c = this.clamp(i)
    if (this.bitmaps[c]) return c
    for (let d = 1; d <= maxDist; d++) {
      const behind = c - d * this.focusDir
      if (behind >= 0 && behind < this.count && this.bitmaps[behind]) return behind
      const ahead = c + d * this.focusDir
      if (ahead >= 0 && ahead < this.count && this.bitmaps[ahead]) return ahead
    }
    return -1
  }

  bitmap(i: number): ImageBitmap | null {
    const b = this.bitmaps[i]
    if (b) this.lastUse[i] = ++this.clock
    return b
  }

  private clamp(i: number) {
    return Math.max(0, Math.min(this.count - 1, Math.round(i)))
  }

  private wanted(j: number) {
    return j >= 0 && j < this.count && (this.fullRate || j % 2 === 0)
  }

  private pumpFetch() {
    while (!this.stopped && this.fetching < this.fetchConcurrency && this.queue.length) {
      const i = this.queue.shift() as number
      if (this.status[i] !== 0) continue
      this.status[i] = 1
      this.fetching++
      fetch(this.url(i), { signal: this.abort.signal })
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
        .then((blob) => {
          if (this.stopped) return
          this.blobs[i] = blob
          this.status[i] = 2
          this.loadedCount++
          this.onFrame(i)
          this.pumpDecode()
        })
        .catch(() => {
          if (!this.stopped) this.status[i] = 3
        })
        .finally(() => {
          this.fetching--
          this.pumpFetch()
        })
    }
  }

  private decodable(j: number) {
    return j >= 0 && j < this.count && this.status[j] === 2 && !this.bitmaps[j] && !this.decoding[j]
  }

  private nextToDecode(): number {
    const c = this.focusAt
    const dir = this.focusDir
    for (let d = 0; d <= AHEAD; d++) {
      const a = c + d * dir
      if (this.decodable(a)) return a
      if (d > 0 && d <= BEHIND) {
        const b = c - d * dir
        if (this.decodable(b)) return b
      }
    }
    return -1
  }

  private pumpDecode() {
    while (!this.stopped && this.decodingCount < this.decodeConcurrency) {
      const j = this.nextToDecode()
      if (j < 0) return
      this.decoding[j] = 1
      this.decodingCount++
      createImageBitmap(this.blobs[j] as Blob)
        .then((bmp) => {
          if (this.stopped) {
            bmp.close()
            return
          }
          this.bitmaps[j] = bmp
          this.lastUse[j] = ++this.clock
          this.cached++
          this.evict()
          this.onFrame(j)
        })
        .catch(() => undefined)
        .finally(() => {
          this.decoding[j] = 0
          this.decodingCount--
          this.pumpDecode()
        })
    }
  }

  private evict() {
    while (this.cached > this.cacheSize) {
      let worst = -1
      let worstUse = Infinity
      for (let k = 0; k < this.count; k++) {
        const b = this.bitmaps[k]
        if (!b || Math.abs(k - this.focusAt) <= BEHIND + 4) continue
        if (this.lastUse[k] < worstUse) {
          worst = k
          worstUse = this.lastUse[k]
        }
      }
      if (worst < 0) return
      this.bitmaps[worst]?.close()
      this.bitmaps[worst] = null
      this.cached--
    }
  }
}
