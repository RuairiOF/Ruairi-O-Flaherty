import {
  FILM_FRAME_COUNT,
  FILM_GRID_H,
  FILM_GRID_W,
  FILM_HEIGHT,
  FILM_LUMA_GRID_B64,
  FILM_WIDTH,
} from '../../content/film'

let grid: Uint8Array | null = null

function data(): Uint8Array {
  if (!grid) {
    const bin = atob(FILM_LUMA_GRID_B64)
    grid = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) grid[i] = bin.charCodeAt(i)
  }
  return grid
}

function cell(frame: number, gx: number, gy: number): number {
  const x = Math.max(0, Math.min(FILM_GRID_W - 1, gx))
  const y = Math.max(0, Math.min(FILM_GRID_H - 1, gy))
  return data()[frame * FILM_GRID_W * FILM_GRID_H + y * FILM_GRID_W + x]
}

function sampleFrame(frame: number, fx: number, fy: number): number {
  const gx = (fx / FILM_WIDTH) * FILM_GRID_W - 0.5
  const gy = (fy / FILM_HEIGHT) * FILM_GRID_H - 0.5
  const x0 = Math.floor(gx)
  const y0 = Math.floor(gy)
  const tx = gx - x0
  const ty = gy - y0
  const a = cell(frame, x0, y0) * (1 - tx) + cell(frame, x0 + 1, y0) * tx
  const b = cell(frame, x0, y0 + 1) * (1 - tx) + cell(frame, x0 + 1, y0 + 1) * tx
  return a * (1 - ty) + b * ty
}

/** Mean luminance (0-255) of the film at frame-pixel coordinates, blended between frames. */
export function lumaAt(frame: number, fx: number, fy: number): number {
  const f0 = Math.max(0, Math.min(FILM_FRAME_COUNT - 1, Math.floor(frame)))
  const f1 = Math.min(FILM_FRAME_COUNT - 1, f0 + 1)
  const t = frame - f0
  const a = sampleFrame(f0, fx, fy)
  return t > 0.001 ? a * (1 - t) + sampleFrame(f1, fx, fy) * t : a
}

export type Tone = 'ink' | 'light'

/** Dark text on light film, white text on dark film, with hysteresis so it never flickers. */
export function toneFor(luma: number, current: Tone | undefined): Tone {
  if (current === 'light') return luma > 166 ? 'ink' : 'light'
  if (current === 'ink') return luma < 134 ? 'light' : 'ink'
  return luma > 150 ? 'ink' : 'light'
}
