import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import {
  FILM_DRAWING_ANCHORS,
  FILM_FRAME_COUNT,
  FILM_HEIGHT,
  FILM_WATERLINE_0,
  FILM_WIDTH,
} from '../../content/film'
import { FrameStore, filmFrameUrl } from './frames'
import { lumaAt, toneFor, type Tone } from './luma'
import { getFilmNav, resetFilmNav, setFilmNav } from './navTone'
import { scrollToY } from './scroll'
import { ABOUT_FACTS, ABOUT_TEXT, FILM_CREDIT, HERO_EYEBROW, HERO_LEAD, HERO_PLACE } from './copy'
import {
  CALLOUTS,
  CALLOUT_FADE,
  CHAPTERS,
  DEPTH_END_FRAME,
  DEPTH_MAX_M,
  DEPTH_START_FRAME,
  DRAWING_FRAMES,
  FILM_FPS,
  LAYER_RAMP,
  LAYER_START_FRAME,
  LAYER_TOTAL,
  TEXT_BLOCKS,
  TOTAL_VH,
  chapterAt,
  sampleAtVh,
  vhForFrame,
} from './timeline'

gsap.registerPlugin(SplitText)

const LAST_FRAME = FILM_FRAME_COUNT - 1
const DEPTH_PX_PER_M = 26
const PAPER_LUMA = 244
/** Scroll (in viewport heights) over which the hero parts at the horizon. */
const HERO_EXIT_VH = 0.42

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
})
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const smoothstep = (t: number) => t * t * (3 - 2 * t)
const fmtTime = (s: number) => `00:${s.toFixed(1).padStart(4, '0')}`

/**
 * Cover-fit, but on screens narrower than the film the crop leans right: the
 * left of every shot is empty paper or water, while the drawing's labels sit
 * near the right edge. Matches object-position on the poster.
 */
const CROP_BIAS_X = 0.7
function cover(w: number, h: number) {
  const s = Math.max(w / FILM_WIDTH, h / FILM_HEIGHT)
  return {
    x: (w - FILM_WIDTH * s) * CROP_BIAS_X,
    y: (h - FILM_HEIGHT * s) / 2,
    w: FILM_WIDTH * s,
    h: FILM_HEIGHT * s,
    s,
  }
}

/** Where the film comes to rest beside the About text. */
function figureRect(w: number, h: number): Rect {
  const gutter = Math.min(108, Math.max(22, w * 0.056)) // matches --gutter in home.css
  const fw = Math.round(w * 0.46)
  const fh = Math.round((fw * 9) / 16)
  return { x: Math.round(w - fw - gutter), y: Math.round((h - fh) / 2 - h * 0.03), w: fw, h: fh }
}

/** First frame each balloon exists on, which is when its label is typed. */
const CALLOUT_APPEAR: Record<string, number> = Object.fromEntries(
  CALLOUTS.map((c) => [c.key, Math.min(...Object.keys(FILM_DRAWING_ANCHORS[c.key]).map(Number))]),
)

function anchorAt(key: string, frame: number): [number, number] | null {
  const table = FILM_DRAWING_ANCHORS[key]
  const keys = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b)
  if (!keys.length) return null
  if (frame <= keys[0]) return table[keys[0]]
  if (frame >= keys[keys.length - 1]) return table[keys[keys.length - 1]]
  let lo = keys[0]
  let hi = keys[keys.length - 1]
  for (const k of keys) {
    if (k <= frame) lo = k
    if (k >= frame) {
      hi = k
      break
    }
  }
  if (lo === hi) return table[lo]
  const t = (frame - lo) / (hi - lo)
  return [lerp(table[lo][0], table[hi][0], t), lerp(table[lo][1], table[hi][1], t)]
}

export function FilmStage() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!section || !stage || !canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = stage) =>
      root.querySelector(sel) as T
    const qa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = stage) =>
      Array.from(root.querySelectorAll<T>(sel)) as T[]

    const media = q('[data-media]')
    const poster = q<HTMLImageElement>('[data-poster]')
    const horizon = q('[data-horizon]')
    const figFrame = q('[data-figure-frame]')
    const hero = q('[data-hero]')
    const heroInner = q('[data-hero-inner]')
    const heroTop = q('[data-hero-top]')
    const heroBottom = q('[data-hero-bottom]')
    const heroTitle = q('[data-hero-title]')
    const heroEyebrow = q('[data-hero-eyebrow]')
    const heroLead = q('[data-hero-lead]')
    const cue = q('[data-cue]')
    const cueInner = q('[data-cue-inner]')
    const blocks = qa('[data-block]')
    const callouts = qa('[data-callout]')
    const hud = q('[data-hud]')
    const hudInner = q('[data-hud-inner]')
    const railTicks = qa('[data-rail-tick]')
    const figIndex = q('[data-fig-index]')
    const figText = q('[data-fig-text]')
    const tcNow = q('[data-tc]')
    const loader = q('[data-load]')
    const loadBar = q('[data-load-bar]')
    const loadPct = q('[data-load-pct]')
    const depthBox = q('[data-depth]')
    const depthValue = q('[data-depth-value]')
    const depthRuler = q('[data-depth-ruler]')
    const layerBox = q('[data-layer]')
    const layerValue = q('[data-layer-value]')
    const layerFill = q('[data-layer-fill]')
    const about = q('[data-about]')
    const outroCap = q('[data-outro-cap]')
    const replay = q<HTMLButtonElement>('[data-replay]')
    const replayLabel = q('[data-replay-label]')
    const adaptive = qa('[data-adapt]')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let vw = 1
    let vh = 1
    let dpr = 1
    let wlY = 0
    let targetVh = 0
    let currentVh = 0
    let lastT = performance.now()
    let raf = 0
    let dirty = true
    let settling = false
    let alive = true
    let onScreen = true
    let firstDraw = false
    let blend = 0
    let lastClip = ''
    let lastTc = ''

    /** Opening: the horizon is drawn, then the picture opens out from it. */
    const intro = { open: 1, scale: 1 }
    const playback = { active: false, frame: 0 }

    resetFilmNav()

    // ------------------------------------------------------------ frames
    const store = new FrameStore(
      filmFrameUrl,
      FILM_FRAME_COUNT,
      () => {
        dirty = true
        const p = store.loadedCount / FILM_FRAME_COUNT
        loadBar.style.transform = `scaleX(${p.toFixed(3)})`
        loadPct.textContent = `${Math.round(p * 100)}%`
        if (store.loadedCount >= FILM_FRAME_COUNT) loader.classList.add('is-done')
      },
      8,
    )
    store.start()

    // ------------------------------------------------------------ tone probes
    type Probe = { el: HTMLElement; rect: Rect; tone?: Tone }
    let probes: Probe[] = []
    const measureProbes = () => {
      const s = stage.getBoundingClientRect()
      probes = adaptive.map((el) => {
        const r = el.getBoundingClientRect()
        return {
          el,
          rect: { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height },
          tone: el.dataset.tone as Tone | undefined,
        }
      })
    }

    const resize = () => {
      vw = Math.max(1, stage.clientWidth)
      vh = Math.max(1, stage.clientHeight)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(vw * dpr)
      canvas.height = Math.round(vh * dpr)
      const c = cover(vw, vh)
      wlY = c.y + FILM_WATERLINE_0 * FILM_HEIGHT * c.s
      stage.style.setProperty('--rh-wl', `${Math.round(wlY)}px`)
      stage.style.setProperty('--rh-callout-gap', `${(15 * c.s).toFixed(1)}px`)
      stage.style.setProperty('--rh-balloon', `${(8.4 * c.s).toFixed(1)}px`)
      const f = figureRect(vw, vh)
      stage.style.setProperty('--rh-fig-x', `${f.x}px`)
      stage.style.setProperty('--rh-fig-y', `${f.y}px`)
      stage.style.setProperty('--rh-fig-w', `${f.w}px`)
      stage.style.setProperty('--rh-fig-h', `${f.h}px`)
      lastClip = ''
      measureProbes()
      dirty = true
    }

    const readScroll = () => {
      const r = section.getBoundingClientRect()
      const h = window.innerHeight || 1
      targetVh = Math.max(0, Math.min(TOTAL_VH, -r.top / h))
      onScreen = r.bottom > 0 && r.top < h
      const f = sampleAtVh(targetVh).frame
      if (!store.isReady(Math.round(f))) store.prioritise(f)
    }

    // ------------------------------------------------------------ chapter text
    type BlockParts = { el: HTMLElement; items: Element[] }
    let blockParts: BlockParts[] = []
    let activeBlock = -1
    let prevFrame = 0
    const showBlock = (i: number, dir: number) => {
      const p = blockParts[i]
      if (!p) return
      gsap.set(p.el, { autoAlpha: 1 })
      gsap.fromTo(
        p.items,
        { yPercent: dir > 0 ? 110 : -110 },
        { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, overwrite: true },
      )
    }
    const hideBlock = (i: number, dir: number) => {
      const p = blockParts[i]
      if (!p) return
      gsap.to(p.items, {
        yPercent: dir > 0 ? -110 : 110,
        duration: 0.5,
        ease: 'power3.in',
        stagger: 0.03,
        overwrite: true,
        onComplete: () => {
          gsap.set(p.el, { autoAlpha: 0 })
        },
      })
    }
    const setBlock = (i: number, frame: number) => {
      if (i === activeBlock) return
      if (activeBlock >= 0) hideBlock(activeBlock, frame > TEXT_BLOCKS[activeBlock].to ? 1 : -1)
      if (i >= 0) showBlock(i, prevFrame <= TEXT_BLOCKS[i].from + 0.5 ? 1 : -1)
      activeBlock = i
    }

    // ------------------------------------------------------------ callouts
    const calloutOn = callouts.map(() => false)
    let calloutChars: Element[][] = callouts.map(() => [])
    const typeIn = (i: number) => {
      const el = callouts[i]
      const num = q('[data-callout-num]', el)
      gsap.set(el, { visibility: 'visible' })
      gsap.fromTo(
        num,
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.4)', overwrite: true },
      )
      const chars = calloutChars[i]
      if (chars.length) {
        gsap.fromTo(
          chars,
          { opacity: 0 },
          { opacity: 1, duration: 0.01, ease: 'none', stagger: 0.032, delay: 0.14, overwrite: true },
        )
      }
    }
    const typeOut = (i: number) => {
      const el = callouts[i]
      const num = q('[data-callout-num]', el)
      gsap.to([num, ...calloutChars[i]], {
        opacity: 0,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: true,
        onComplete: () => {
          if (!calloutOn[i]) gsap.set(el, { visibility: 'hidden' })
        },
      })
    }

    // ------------------------------------------------------------ about
    let aboutShown = false
    let aboutLines: Element[] = []
    const showAbout = (on: boolean) => {
      aboutShown = on
      const facts = qa('[data-about-fact]', about)
      const label = q('[data-about-label]', about)
      if (on) {
        gsap.set([about, outroCap], { autoAlpha: 1 })
        gsap.fromTo(label, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', overwrite: true })
        gsap.fromTo(
          aboutLines,
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: 0.05, overwrite: true },
        )
        gsap.fromTo(
          facts,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.35, overwrite: true },
        )
        gsap.fromTo(
          outroCap,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: 0.3, overwrite: 'auto' },
        )
      } else {
        gsap.to(label, { opacity: 0, duration: 0.3, overwrite: true })
        gsap.to(aboutLines, { yPercent: 110, duration: 0.45, ease: 'power3.in', stagger: 0.02, overwrite: true })
        gsap.to(facts, { opacity: 0, y: 10, duration: 0.3, overwrite: true })
        gsap.to(outroCap, {
          opacity: 0,
          duration: 0.3,
          overwrite: 'auto',
          onComplete: () => {
            if (!aboutShown) gsap.set([about, outroCap], { autoAlpha: 0 })
          },
        })
      }
    }

    // ------------------------------------------------------------ split text
    let splits: SplitText[] = []
    let heroChars: Element[] = []
    let heroLeadLines: Element[] = []
    let introDone = false

    const buildSplits = () => {
      splits.forEach((s) => s.revert())
      splits = []
      const lines = (el: Element) => {
        const s = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'rh-line' })
        splits.push(s)
        return s.lines
      }
      blockParts = blocks.map((el) => ({
        el,
        items: [
          q('[data-block-label] > span', el),
          ...lines(q('[data-block-title]', el)),
          ...lines(q('[data-block-body]', el)),
        ],
      }))
      calloutChars = callouts.map((el) => {
        const s = new SplitText(q('[data-callout-text]', el), { type: 'chars' })
        splits.push(s)
        return s.chars
      })
      aboutLines = lines(q('[data-about-lead]', about))
      const ht = new SplitText(heroTitle, { type: 'lines,chars', mask: 'lines', linesClass: 'rh-line' })
      splits.push(ht)
      heroChars = ht.chars
      heroLeadLines = lines(heroLead)

      // Put everything back where the scroll position says it should be.
      blockParts.forEach((p, i) => {
        gsap.set(p.items, { yPercent: i === activeBlock ? 0 : 110 })
        gsap.set(p.el, { autoAlpha: i === activeBlock ? 1 : 0 })
      })
      gsap.set(aboutLines, { yPercent: aboutShown ? 0 : 110 })
      if (introDone) gsap.set([...heroChars, ...heroLeadLines], { yPercent: 0 })
      calloutOn.forEach((on, i) => gsap.set(calloutChars[i], { opacity: on ? 1 : 0 }))
    }

    // ------------------------------------------------------------ chapter caption
    let activeChapter = -1
    const setChapter = (i: number) => {
      if (i === activeChapter) return
      const first = activeChapter === -1
      activeChapter = i
      railTicks.forEach((t, k) => {
        t.classList.toggle('is-active', k === i)
        t.classList.toggle('is-past', k < i)
        if (k === i) t.setAttribute('aria-current', 'step')
        else t.removeAttribute('aria-current')
      })
      const ch = CHAPTERS[i]
      if (first) {
        figIndex.textContent = `Fig. ${ch.index}`
        figText.textContent = ch.figure
        return
      }
      gsap.killTweensOf([figIndex, figText])
      gsap
        .timeline()
        .to([figIndex, figText], { yPercent: -115, duration: 0.32, ease: 'power3.in', stagger: 0.04 })
        .add(() => {
          figIndex.textContent = `Fig. ${ch.index}`
          figText.textContent = ch.figure
        })
        .fromTo([figIndex, figText], { yPercent: 115 }, { yPercent: 0, duration: 0.75, ease: 'expo.out', stagger: 0.05 })
    }

    // ------------------------------------------------------------ playback inside the figure
    const setReplayLabel = () => {
      replayLabel.textContent = playback.active ? 'Pause the film' : 'Play the film'
      replay.setAttribute('aria-pressed', playback.active ? 'true' : 'false')
    }
    const stopPlayback = () => {
      if (!playback.active) return
      playback.active = false
      setReplayLabel()
      dirty = true
    }
    const onReplay = () => {
      if (playback.active) {
        stopPlayback()
        return
      }
      if (playback.frame >= LAST_FRAME - 0.5) playback.frame = 0
      playback.active = true
      setReplayLabel()
      dirty = true
    }
    replay.addEventListener('click', onReplay)

    // ------------------------------------------------------------ render
    const screenLuma = (x: number, y: number, img: Rect, clip: Rect, s: number, frame: number) => {
      if (x < clip.x || y < clip.y || x > clip.x + clip.w || y > clip.y + clip.h) return PAPER_LUMA
      return lumaAt(frame, (x - img.x) / s, (y - img.y) / s)
    }

    let depthOn = false
    let layerOn = false
    const render = (moving: boolean, dt: number) => {
      const sample = sampleAtVh(currentVh)
      const outro = sample.outro
      if (outro < 0.999) {
        stopPlayback()
        playback.frame = 0
      }
      const frame = playback.active || (outro >= 0.999 && playback.frame > 0) ? playback.frame : sample.frame
      const e = easeInOutCubic(outro)
      const c = cover(vw, vh)
      const fr = figureRect(vw, vh)
      let img = lerpRect(c, fr, e)
      if (intro.scale !== 1) {
        const k = intro.scale
        img = { x: vw / 2 + (img.x - vw / 2) * k, y: wlY + (img.y - wlY) * k, w: img.w * k, h: img.h * k }
      }
      let clip = lerpRect({ x: 0, y: 0, w: vw, h: vh }, fr, e)
      if (intro.open < 1) {
        const top = wlY * (1 - intro.open)
        const bottom = wlY + (vh - wlY) * intro.open
        const y0 = Math.max(clip.y, top)
        const y1 = Math.min(clip.y + clip.h, bottom)
        clip = { x: clip.x, y: y0, w: clip.w, h: Math.max(0, y1 - y0) }
      }
      const s = img.w / FILM_WIDTH

      // the picture (and its grain) only shows inside the window
      const full = clip.x <= 0.5 && clip.y <= 0.5 && clip.w >= vw - 0.5 && clip.h >= vh - 0.5
      const clipCss = full
        ? 'none'
        : `inset(${clip.y.toFixed(1)}px ${(vw - clip.x - clip.w).toFixed(1)}px ${(vh - clip.y - clip.h).toFixed(1)}px ${clip.x.toFixed(1)}px)`
      if (clipCss !== lastClip) {
        media.style.clipPath = clipCss === 'none' ? '' : clipCss
        lastClip = clipCss
      }
      if (!firstDraw) {
        poster.style.transformOrigin = `50% ${wlY.toFixed(1)}px`
        poster.style.transform = intro.scale !== 1 ? `scale(${intro.scale})` : ''
      }

      // the frame itself, blended with the next while moving, settling on a whole frame at rest
      const base = Math.min(LAST_FRAME, Math.floor(frame))
      const frac = frame - base
      const live = moving || playback.active
      const blendTarget = live ? frac : frac >= 0.5 ? 1 : 0
      if (live) blend = frac
      else {
        blend += (blendTarget - blend) * (1 - Math.exp(-dt * 12))
        if (Math.abs(blend - blendTarget) < 0.01) blend = blendTarget
      }
      settling = blend !== blendTarget
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalAlpha = 1
      ctx.fillStyle = '#f5f4ef'
      ctx.fillRect(0, 0, vw, vh)
      const i0 = store.nearest(base)
      const im0 = i0 >= 0 ? store.images[i0] : null
      if (im0) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(im0, img.x, img.y, img.w, img.h)
        const i1 = base + 1
        const im1 = i1 <= LAST_FRAME ? store.images[i1] : null
        if (blend > 0.003 && i0 === base && im1 && store.isReady(i1)) {
          ctx.globalAlpha = blend
          ctx.drawImage(im1, img.x, img.y, img.w, img.h)
          ctx.globalAlpha = 1
        }
        if (!firstDraw) {
          firstDraw = true
          stage.classList.add('is-ready')
          poster.style.transform = ''
        }
      }

      // a hairline frames the picture as it becomes a figure
      const frameOpacity = clamp01((e - 0.2) / 0.5)
      figFrame.style.opacity = frameOpacity.toFixed(3)
      if (frameOpacity > 0) {
        figFrame.style.transform = `translate3d(${clip.x.toFixed(1)}px, ${clip.y.toFixed(1)}px, 0)`
        figFrame.style.width = `${clip.w.toFixed(1)}px`
        figFrame.style.height = `${clip.h.toFixed(1)}px`
      }

      // the hero parts at the horizon as soon as the reader scrolls
      const h = clamp01(currentVh / HERO_EXIT_VH)
      const hs = smoothstep(h)
      hero.style.opacity = (1 - hs).toFixed(3)
      heroTop.style.transform = `translate3d(0, ${(-hs * 70).toFixed(1)}px, 0)`
      heroBottom.style.transform = `translate3d(0, ${(hs * 46).toFixed(1)}px, 0)`
      hero.style.visibility = h >= 1 ? 'hidden' : ''
      cue.style.opacity = (1 - clamp01(currentVh / 0.1)).toFixed(3)

      // chapter text
      let blockIdx = -1
      if (outro < 0.02 && !playback.active) {
        TEXT_BLOCKS.forEach((b, i) => {
          if (frame >= b.from && frame <= b.to) blockIdx = i
        })
      }
      setBlock(blockIdx, frame)
      prevFrame = frame

      // balloons on the drawing get their numbers and part names
      callouts.forEach((el, i) => {
        const key = CALLOUTS[i].key
        const want =
          outro === 0 && !playback.active && frame >= CALLOUT_APPEAR[key] - 0.2 && frame < CALLOUT_FADE[1]
        if (want !== calloutOn[i]) {
          calloutOn[i] = want
          if (want) typeIn(i)
          else typeOut(i)
        }
        if (!want) return
        const pos = anchorAt(key, frame)
        if (!pos) return
        const fade = 1 - clamp01((frame - CALLOUT_FADE[0]) / (CALLOUT_FADE[1] - CALLOUT_FADE[0]))
        el.style.opacity = fade.toFixed(3)
        el.style.transform = `translate3d(${(img.x + pos[0] * s).toFixed(1)}px, ${(img.y + pos[1] * s).toFixed(1)}px, 0)`
      })

      // instruments
      setChapter(chapterAt(frame))
      const hudFade = 1 - clamp01(outro / 0.22)
      hud.style.opacity = hudFade.toFixed(3)
      hud.style.visibility = hudFade <= 0 ? 'hidden' : ''
      const tc = fmtTime(frame / FILM_FPS)
      if (tc !== lastTc) {
        tcNow.textContent = tc
        lastTc = tc
      }

      const wantDepth =
        frame > DEPTH_START_FRAME - 6 && frame < LAYER_START_FRAME && outro < 0.02 && !playback.active
      if (wantDepth !== depthOn) {
        depthOn = wantDepth
        depthBox.classList.toggle('is-on', wantDepth)
      }
      if (wantDepth) {
        const d = clamp01((frame - DEPTH_START_FRAME) / (DEPTH_END_FRAME - DEPTH_START_FRAME)) * DEPTH_MAX_M
        depthValue.textContent = `${d.toFixed(1).padStart(4, '0')} m`
        depthRuler.style.transform = `translate3d(0, ${(-d * DEPTH_PX_PER_M).toFixed(1)}px, 0)`
      }
      const wantLayer = frame >= LAYER_START_FRAME && outro < 0.02 && !playback.active
      if (wantLayer !== layerOn) {
        layerOn = wantLayer
        layerBox.classList.toggle('is-on', wantLayer)
      }
      if (wantLayer) {
        const t = clamp01((frame - LAYER_RAMP[0]) / (LAYER_RAMP[1] - LAYER_RAMP[0]))
        const n = Math.max(1, Math.round(1 + (LAYER_TOTAL - 1) * smoothstep(t)))
        layerValue.textContent = String(n).padStart(3, '0')
        layerFill.style.transform = `scaleY(${(n / LAYER_TOTAL).toFixed(4)})`
      }

      // About sits beside the film once it has become a figure
      const wantAbout = outro > 0.84
      if (wantAbout !== aboutShown) showAbout(wantAbout)

      // every overlay takes ink or white from the picture underneath it
      for (const p of probes) {
        const r = p.rect
        const pts: [number, number][] = [
          [r.x + r.w * 0.5, r.y + r.h * 0.5],
          [r.x + r.w * 0.12, r.y + r.h * 0.25],
          [r.x + r.w * 0.88, r.y + r.h * 0.25],
          [r.x + r.w * 0.12, r.y + r.h * 0.75],
          [r.x + r.w * 0.88, r.y + r.h * 0.75],
        ]
        let sum = 0
        for (const [x, y] of pts) sum += screenLuma(x, y, img, clip, s, frame)
        const tone = toneFor(sum / pts.length, p.tone)
        if (tone !== p.tone) {
          p.tone = tone
          p.el.dataset.tone = tone
        }
      }

      // and so does the navigation bar, one part at a time
      const navTone = (xs: number[], prev: Tone) => {
        let sum = 0
        for (const fx of xs) sum += screenLuma(vw * fx, 36, img, clip, s, frame)
        return toneFor(sum / xs.length, prev)
      }
      const prevNav = getFilmNav()
      setFilmNav({
        tone: navTone([0.03, 0.07, 0.11, 0.15], prevNav.tone),
        linksTone: navTone([0.38, 0.43, 0.48, 0.53, 0.58, 0.62], prevNav.linksTone),
        clockTone: navTone([0.86, 0.9, 0.94], prevNav.clockTone),
        hero: currentVh < HERO_EXIT_VH * 0.8,
        quietRight: outro === 0 && frame > DRAWING_FRAMES[0] && frame < DRAWING_FRAMES[1],
      })
    }

    // ------------------------------------------------------------ loop
    const tick = (now: number) => {
      if (!alive) return
      const dt = Math.min(0.05, Math.max(0, (now - lastT) / 1000))
      lastT = now
      const diff = targetVh - currentVh
      const moving = Math.abs(diff) > 0.0005
      if (moving) currentVh += diff * (1 - Math.exp(-dt * 8.5))
      else currentVh = targetVh
      if (playback.active) {
        playback.frame = Math.min(LAST_FRAME, playback.frame + dt * FILM_FPS)
        if (playback.frame >= LAST_FRAME) stopPlayback()
      }
      if (onScreen && (moving || dirty || settling || playback.active)) {
        render(moving, dt)
        dirty = false
      }
      raf = requestAnimationFrame(tick)
    }

    // ------------------------------------------------------------ rail
    const onRailClick = (ev: Event) => {
      const btn = (ev.target as HTMLElement).closest<HTMLElement>('[data-rail-tick]')
      if (!btn) return
      const ch = CHAPTERS[Number(btn.dataset.index)]
      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const at = ch.start === 0 ? 0 : vhForFrame(ch.start + 1)
      scrollToY(sectionTop + at * window.innerHeight)
    }
    stage.addEventListener('click', onRailClick)

    // ------------------------------------------------------------ opening
    const finishIntro = () => {
      introDone = true
      intro.open = 1
      intro.scale = 1
      setFilmNav({ ready: true })
      dirty = true
    }
    const skipIntro = () => {
      gsap.set(heroInner, { visibility: 'visible' })
      gsap.set([cueInner, hudInner], { opacity: 1 })
      gsap.set(horizon, { opacity: 0 })
      finishIntro()
    }
    const playIntro = () => {
      gsap
        .timeline({ onUpdate: () => void (dirty = true), onComplete: finishIntro })
        .to(intro, { open: 1, duration: 1.5, ease: 'expo.inOut' }, 0)
        .to(intro, { scale: 1, duration: 2.6, ease: 'expo.out' }, 0)
        .to(horizon, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.55)
        .set(heroInner, { visibility: 'visible' }, 0.3)
        .fromTo(heroChars, { yPercent: 112 }, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.026 }, 0.3)
        .fromTo(heroEyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' }, 0.75)
        .fromTo(heroLeadLines, { yPercent: -112 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08 }, 0.5)
        .to(hudInner, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 1.0)
        .to(cueInner, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 1.2)
        .add(() => setFilmNav({ ready: true }), 0.9)
    }

    const ro = new ResizeObserver(() => {
      resize()
      readScroll()
    })
    ro.observe(stage)
    resize()
    readScroll()
    currentVh = targetVh

    const startAtTop = targetVh < 0.05 && !reduceMotion
    if (startAtTop) {
      intro.open = 0
      intro.scale = 1.12
      gsap.fromTo(horizon, { scaleX: 0 }, { scaleX: 1, duration: 0.95, ease: 'expo.inOut', delay: 0.05 })
    }

    window.addEventListener('scroll', readScroll, { passive: true })

    // Wait for the type and the first frame, but never hold the page for long.
    const mountedAt = performance.now()
    let started = false
    const begin = () => {
      if (!alive || started) return
      started = true
      buildSplits()
      measureProbes()
      if (!startAtTop) {
        skipIntro()
        return
      }
      const wait = Math.max(0, 880 - (performance.now() - mountedAt))
      window.setTimeout(() => {
        if (!alive) return
        if (!store.isReady(0)) intro.scale = 1
        playIntro()
      }, wait)
    }
    const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(() => undefined)
    const firstFrame = new Promise<void>((resolve) => {
      const check = () => {
        if (store.isReady(0) || !alive) resolve()
        else window.setTimeout(check, 30)
      }
      check()
    })
    Promise.all([fontsReady, firstFrame]).then(begin)
    const beginTimeout = window.setTimeout(begin, 2600)

    let resizeTimer = 0
    const onWinResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (!started) return
        buildSplits()
        measureProbes()
        dirty = true
      }, 180)
    }
    window.addEventListener('resize', onWinResize)

    raf = requestAnimationFrame(tick)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.clearTimeout(beginTimeout)
      window.clearTimeout(resizeTimer)
      store.stop()
      ro.disconnect()
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', onWinResize)
      stage.removeEventListener('click', onRailClick)
      replay.removeEventListener('click', onReplay)
      gsap.killTweensOf([intro, horizon, heroInner, heroEyebrow, cueInner, hudInner, figIndex, figText, about, outroCap])
      blockParts.forEach((p) => gsap.killTweensOf(p.items))
      splits.forEach((s) => s.revert())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="rh-film"
      style={{ height: `${(TOTAL_VH + 1) * 100}vh` }}
      data-nav-section="film"
      aria-label="Introduction"
    >
      <div ref={stageRef} className="rh-film__stage">
        <div className="rh-film__media" data-media>
          <img
            className="rh-film__poster"
            data-poster
            src={filmFrameUrl(0)}
            alt=""
            aria-hidden="true"
            decoding="async"
            {...{ fetchpriority: 'high' }}
          />
          <canvas ref={canvasRef} className="rh-film__canvas" aria-hidden="true" />
          <div className="rh-film__grain" aria-hidden="true" />
        </div>
        <div className="rh-horizon" data-horizon aria-hidden="true" />
        <div className="rh-figure-frame" data-figure-frame aria-hidden="true" />

        <div className="rh-hero" data-hero>
          <div className="rh-hero__inner" data-hero-inner>
            <div className="rh-hero__top" data-hero-top>
              <p className="rh-hero__eyebrow" data-hero-eyebrow>
                <span className="rh-dot" aria-hidden="true" />
                {HERO_EYEBROW}
                <span aria-hidden="true">·</span>
                {HERO_PLACE}
              </p>
              <h1 className="rh-hero__title" data-hero-title>
                Ruairí
                <br />
                O’Flaherty
              </h1>
            </div>
            <div className="rh-hero__bottom" data-hero-bottom>
              <p className="rh-hero__lead" data-hero-lead>
                {HERO_LEAD}
              </p>
            </div>
          </div>
        </div>

        <div className="rh-cue" data-cue aria-hidden="true">
          <div className="rh-cue__inner" data-cue-inner data-adapt>
            <span className="rh-cue__line" />
            <span>Scroll</span>
          </div>
        </div>

        {TEXT_BLOCKS.map((b) => (
          <div key={b.id} className="rh-block" data-block={b.id} data-adapt aria-hidden="true">
            <p className="rh-block__label" data-block-label>
              <span>
                <span className="rh-mono">{b.index}</span>
                {b.label}
              </span>
            </p>
            <h2 className="rh-block__title" data-block-title>
              {b.title}
            </h2>
            <p className="rh-block__body" data-block-body>
              {b.body}
            </p>
          </div>
        ))}

        <div className="rh-callouts" aria-hidden="true">
          {CALLOUTS.map((c) => (
            <div key={c.key} className="rh-callout" data-callout={c.key}>
              <span className="rh-callout__num" data-callout-num>
                {c.index}
              </span>
              <span className="rh-callout__text" data-callout-text>
                {c.text}
              </span>
            </div>
          ))}
        </div>

        <div className="rh-hud" data-hud>
          <div className="rh-hud__inner" data-hud-inner>
            <nav className="rh-rail" aria-label="Film chapters">
              <ol>
                {CHAPTERS.map((ch, i) => (
                  <li key={ch.id}>
                    <button
                      type="button"
                      className="rh-rail__tick"
                      data-rail-tick
                      data-index={i}
                      data-adapt
                      aria-label={`${ch.index} ${ch.rail}`}
                    >
                      <span className="rh-rail__dot" />
                      <span className="rh-rail__label" aria-hidden="true">
                        <span className="rh-mono">{ch.index}</span>
                        {ch.rail}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <p className="rh-figcap" data-adapt aria-hidden="true">
              <span className="rh-figcap__clip">
                <span className="rh-mono" data-fig-index>
                  Fig. 00
                </span>
              </span>
              <span className="rh-figcap__clip">
                <span data-fig-text>Surface</span>
              </span>
            </p>

            <div className="rh-timecode" data-adapt aria-hidden="true">
              <span className="rh-timecode__load" data-load>
                <span>Loading film</span>
                <span className="rh-timecode__bar">
                  <span data-load-bar />
                </span>
                <span className="rh-mono" data-load-pct>
                  0%
                </span>
              </span>
              <span className="rh-mono" data-tc>
                00:00.0
              </span>
              <span className="rh-mono rh-timecode__total">/ {fmtTime(LAST_FRAME / FILM_FPS)}</span>
            </div>

            <div className="rh-gauge" data-depth data-adapt aria-hidden="true">
              <div className="rh-gauge__window">
                <div className="rh-gauge__ruler" data-depth-ruler>
                  {Array.from({ length: 21 }, (_, m) => (
                    <span
                      key={m}
                      className={`rh-gauge__mark${m % 5 === 0 ? ' is-major' : ''}`}
                      style={{ top: `${m * DEPTH_PX_PER_M}px` }}
                    >
                      {m % 5 === 0 ? <span className="rh-mono">{m}</span> : null}
                    </span>
                  ))}
                </div>
                <span className="rh-gauge__needle" />
              </div>
              <p className="rh-gauge__readout">
                <span>Depth</span>
                <span className="rh-mono" data-depth-value>
                  00.0 m
                </span>
              </p>
            </div>

            <div className="rh-gauge" data-layer data-adapt aria-hidden="true">
              <div className="rh-gauge__column">
                <span className="rh-gauge__fill" data-layer-fill />
              </div>
              <p className="rh-gauge__readout">
                <span>Layer</span>
                <span className="rh-mono">
                  <span data-layer-value>001</span> / {LAYER_TOTAL}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="rh-about" data-about>
          <p className="rh-about__label" data-about-label>
            <span className="rh-mono">06</span>
            About
          </p>
          <p className="rh-about__lead" data-about-lead>
            {ABOUT_TEXT}
          </p>
          <dl className="rh-about__facts">
            {ABOUT_FACTS.map(([k, v]) => (
              <div key={k} className="rh-about__fact" data-about-fact>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rh-outro-cap" data-outro-cap>
          <span>
            <span className="rh-mono">Fig. 05</span>
            {FILM_CREDIT}
          </span>
          <button type="button" className="rh-replay" data-replay aria-pressed="false">
            <svg viewBox="0 0 9 10" aria-hidden="true" className="rh-replay__play">
              <path d="M0 0l9 5-9 5z" fill="currentColor" />
            </svg>
            <svg viewBox="0 0 9 10" aria-hidden="true" className="rh-replay__pause">
              <path d="M1 0h2.4v10H1zM5.6 0H8v10H5.6z" fill="currentColor" />
            </svg>
            <span data-replay-label>Play the film</span>
          </button>
        </div>
      </div>

      {/* What the film says, for screen readers */}
      <div className="sr-only">
        {TEXT_BLOCKS.map((b) => (
          <section key={b.id} aria-label={b.label}>
            <h2>{b.title}</h2>
            <p>{b.body}</p>
          </section>
        ))}
      </div>
    </section>
  )
}
