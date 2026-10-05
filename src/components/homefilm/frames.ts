const BASE = import.meta.env.BASE_URL || '/'
export const filmFrameUrl = (i: number) => `${BASE}film/v1/f${String(i).padStart(3, '0')}.webp`

/**
 * Progressive loader for the film's frame sequence.
 *
 * Frames arrive coarse to fine (every 32nd, then every 16th, ... then all), so
 * the whole film is scrubbable within the first second and sharpens as the
 * rest arrive. Whatever is not loaded yet is drawn from the nearest loaded
 * frame. When the reader jumps ahead, frames around the new position move to
 * the front of the queue.
 */
export class FrameStore {
  readonly images: (HTMLImageElement | null)[]
  private readonly ready: Uint8Array
  private queue: number[] = []
  private queued: Uint8Array
  private inFlight = 0
  private stopped = false
  loadedCount = 0

  constructor(
    private readonly url: (i: number) => string,
    readonly count: number,
    private readonly onFrame: (index: number) => void,
    private readonly concurrency = 6,
  ) {
    this.images = new Array(count).fill(null)
    this.ready = new Uint8Array(count)
    this.queued = new Uint8Array(count)
  }

  start() {
    const order: number[] = [0]
    for (const stride of [32, 16, 8, 4, 2, 1]) {
      for (let i = 0; i < this.count; i += stride) order.push(i)
    }
    order.push(this.count - 1)
    for (const i of order) this.enqueue(i)
    this.pump()
  }

  stop() {
    this.stopped = true
    this.queue = []
  }

  isReady(i: number) {
    return i >= 0 && i < this.count && this.ready[i] === 1
  }

  /** Nearest loaded frame to i, or -1 when nothing has loaded yet. */
  nearest(i: number): number {
    const c = Math.max(0, Math.min(this.count - 1, Math.round(i)))
    if (this.ready[c]) return c
    for (let d = 1; d < this.count; d++) {
      if (c - d >= 0 && this.ready[c - d]) return c - d
      if (c + d < this.count && this.ready[c + d]) return c + d
    }
    return -1
  }

  /** Pull the frames around i to the front of the queue. */
  prioritise(i: number, radius = 10) {
    const c = Math.round(i)
    const near: number[] = []
    for (let d = 0; d <= radius; d++) {
      for (const j of d === 0 ? [c] : [c + d, c - d]) {
        if (j >= 0 && j < this.count && !this.ready[j]) near.push(j)
      }
    }
    if (!near.length) return
    const set = new Set(near)
    this.queue = [...near, ...this.queue.filter((j) => !set.has(j))]
    for (const j of near) this.queued[j] = 1
    this.pump()
  }

  private enqueue(i: number) {
    if (this.queued[i]) return
    this.queued[i] = 1
    this.queue.push(i)
  }

  private pump() {
    while (!this.stopped && this.inFlight < this.concurrency && this.queue.length) {
      const i = this.queue.shift() as number
      if (this.ready[i] || this.images[i]) continue
      this.load(i)
    }
  }

  private load(i: number) {
    this.inFlight++
    const img = new Image()
    img.decoding = 'async'
    if (i === 0) img.fetchPriority = 'high'
    this.images[i] = img
    const done = (ok: boolean) => {
      this.inFlight--
      if (ok && !this.stopped) {
        this.ready[i] = 1
        this.loadedCount++
        this.onFrame(i)
      } else if (!ok) {
        this.images[i] = null
      }
      this.pump()
    }
    img.onload = () => {
      // decode() keeps the first draw off the main thread where supported
      if (typeof img.decode === 'function') img.decode().then(() => done(true), () => done(true))
      else done(true)
    }
    img.onerror = () => done(false)
    img.src = this.url(i)
  }
}
