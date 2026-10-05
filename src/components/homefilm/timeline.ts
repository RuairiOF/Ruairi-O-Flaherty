/**
 * Scroll choreography for the homepage film.
 *
 * The film is 308 frames (12 per second of footage). Scroll is measured in
 * viewport heights (vh); each segment maps a slice of scroll onto a range of
 * frames. Holds (from === to) give the reader time on a frame without the
 * picture moving. After the last frame, the outro shrinks the film into a
 * figure beside the About text.
 */

export interface Segment {
  from: number
  to: number
  vh: number
}

export const SEGMENTS: Segment[] = [
  { from: 0, to: 0, vh: 0.3 }, // hero hold
  { from: 0, to: 30, vh: 1.0 }, // the camera rises out of the sea onto the paper
  { from: 30, to: 48, vh: 1.0 }, // the printhead draws itself
  { from: 48, to: 52, vh: 0.6 }, // hold on the drawing
  { from: 52, to: 64, vh: 0.7 }, // the parts come together
  { from: 64, to: 82, vh: 0.6 }, // the assembled printhead
  { from: 82, to: 120, vh: 1.15 }, // lowered into the sea
  { from: 120, to: 160, vh: 1.1 }, // under the surface
  { from: 160, to: 204, vh: 1.0 }, // down to the seabed
  { from: 204, to: 236, vh: 0.8 }, // the first bead
  { from: 236, to: 268, vh: 0.8 }, // pull back to the first ring
  { from: 268, to: 300, vh: 1.3 }, // the column prints
  { from: 300, to: 307, vh: 0.5 }, // settle
  { from: 307, to: 307, vh: 0.4 }, // hold on the finished column
]

/** Film shrinks into a figure. */
export const OUTRO_VH = 1.2
/** Reading time on the About composition before the page moves on. */
export const OUTRO_HOLD_VH = 0.7

export const FILM_VH = SEGMENTS.reduce((sum, s) => sum + s.vh, 0)
export const TOTAL_VH = FILM_VH + OUTRO_VH + OUTRO_HOLD_VH
/** Phones have no outro: the film holds on its last frame, then the page moves on. */
export const MOBILE_TOTAL_VH = FILM_VH + 0.35

export interface FilmSample {
  /** Fractional frame index. */
  frame: number
  /** 0 during the film, 0 to 1 while the film shrinks into the figure, 1 after. */
  outro: number
}

/** Maps scroll (in vh from the start of the section) to a frame and outro progress. */
export function sampleAtVh(vh: number): FilmSample {
  let acc = 0
  for (const seg of SEGMENTS) {
    if (vh <= acc + seg.vh) {
      const t = seg.vh > 0 ? (vh - acc) / seg.vh : 1
      return { frame: seg.from + (seg.to - seg.from) * Math.max(0, t), outro: 0 }
    }
    acc += seg.vh
  }
  const last = SEGMENTS[SEGMENTS.length - 1].to
  const into = vh - acc
  return { frame: last, outro: Math.min(1, Math.max(0, into / OUTRO_VH)) }
}

/** The scroll position (vh from section start) at which a frame is first reached. */
export function vhForFrame(frame: number): number {
  let acc = 0
  for (const seg of SEGMENTS) {
    const lo = Math.min(seg.from, seg.to)
    const hi = Math.max(seg.from, seg.to)
    if (frame >= lo && frame <= hi && seg.to !== seg.from) {
      return acc + ((frame - seg.from) / (seg.to - seg.from)) * seg.vh
    }
    acc += seg.vh
  }
  return acc
}

export interface Chapter {
  id: string
  index: string
  rail: string
  figure: string
  /** First frame of the chapter. */
  start: number
}

export const CHAPTERS: Chapter[] = [
  { id: 'intro', index: '00', rail: 'Intro', figure: 'Ireland', start: 0 },
  { id: 'design', index: '01', rail: 'Design', figure: 'Printhead, exploded view', start: 30 },
  { id: 'build', index: '02', rail: 'Build', figure: 'Printhead, assembled', start: 54 },
  { id: 'ship', index: '03', rail: 'Ship', figure: 'Deployment', start: 84 },
  { id: 'print', index: '04', rail: 'Print', figure: 'First layer', start: 196 },
  { id: 'now', index: '05', rail: 'Now', figure: 'Printed column, beside the original', start: 268 },
]

export function chapterAt(frame: number): number {
  let idx = 0
  for (let i = 0; i < CHAPTERS.length; i++) {
    if (frame >= CHAPTERS[i].start - 0.5) idx = i
  }
  return idx
}

export interface TextBlock {
  id: string
  /** Visible while the frame is inside [from, to]. */
  from: number
  to: number
  index: string
  label: string
  title: string
  body: string
}

export const TEXT_BLOCKS: TextBlock[] = [
  {
    id: 'design',
    from: 32,
    to: 54,
    index: '01',
    label: 'Design',
    title: 'CAD and part design',
    body: 'I use SolidWorks and Fusion 360 for parts and assemblies, and Blender for renders. The drawing here is a printhead assembly.',
  },
  {
    id: 'build',
    from: 58,
    to: 84,
    index: '02',
    label: 'Build',
    title: 'Printing and assembly',
    body: 'Most of my hardware projects involve 3D-printed parts and some electronics. Running a small print farm gave me plenty of practice with both.',
  },
  {
    id: 'ship',
    from: 124,
    to: 196,
    index: '03',
    label: 'Ship',
    title: 'Shipping and software',
    body: 'EirPost grew out of the label-printing script I used for my own shop. I now work on the software and day-to-day shipping service.',
  },
  {
    id: 'now',
    from: 270,
    to: 999,
    index: '05',
    label: 'Now',
    title: 'Alongside the degree',
    body: 'Currently studying at UCD and working on EirPost and Printbot, with the occasional electronics or bike project in between.',
  },
]

/** Hero copy is on screen until the camera starts to rise. */
export const HERO_LAST_FRAME = 6

/** Drawing callouts: label text per anchor, in drawing order. */
export const CALLOUTS: { key: string; index: string; text: string }[] = [
  { key: 'eye', index: '1', text: 'Lifting eye' },
  { key: 'motor', index: '2', text: 'Motor' },
  { key: 'gearbox', index: '3', text: 'Planetary gearbox' },
  { key: 'coupling', index: '4', text: 'Coupling' },
  { key: 'auger', index: '5', text: 'Auger screw' },
  { key: 'barrel', index: '6', text: 'Barrel and feed inlet' },
  { key: 'nozzle', index: '7', text: 'Nozzle' },
]
/** Callouts fade once the parts start to move. */
export const CALLOUT_FADE: [number, number] = [53, 56]

/** Instruments. */
export const DEPTH_START_FRAME = 118 // camera passes under the surface
export const DEPTH_END_FRAME = 172 // reaches the seabed
export const DEPTH_MAX_M = 14.2
export const LAYER_START_FRAME = 196
export const LAYER_RAMP: [number, number] = [268, 300]
export const LAYER_TOTAL = 412

/** The drawing sits under the right of the navigation bar; the bar keeps that side clear. */
export const DRAWING_FRAMES: [number, number] = [27, 58]

/** Footage runs at 12 frames a second. */
export const FILM_FPS = 12
