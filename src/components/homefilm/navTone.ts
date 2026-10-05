import { useSyncExternalStore } from 'react'
import type { Tone } from './luma'

/** What the film tells the navigation bar about the picture under it. */
export interface FilmNavState {
  /** Ink or white for the name, picked from the frame behind it. */
  tone: Tone
  /** The same for the links in the middle of the bar. */
  linksTone: Tone
  /** And for the clock on the right. */
  clockTone: Tone
  /** The large name in the hero is on screen, so the bar holds back its own. */
  hero: boolean
  /** The drawing is under the right-hand end of the bar. */
  quietRight: boolean
  /** The opening has played (or was skipped). */
  ready: boolean
}

const INITIAL: FilmNavState = {
  tone: 'ink',
  linksTone: 'ink',
  clockTone: 'ink',
  hero: true,
  quietRight: false,
  ready: false,
}
let state: FilmNavState = INITIAL
const listeners = new Set<() => void>()

export function setFilmNav(patch: Partial<FilmNavState>) {
  const keys = Object.keys(patch) as (keyof FilmNavState)[]
  if (keys.every((k) => state[k] === patch[k])) return
  state = { ...state, ...patch }
  listeners.forEach((fn) => fn())
}

export function resetFilmNav(patch: Partial<FilmNavState> = {}) {
  state = { ...INITIAL, ...patch }
  listeners.forEach((fn) => fn())
}

export const getFilmNav = () => state

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function useFilmNav(): FilmNavState {
  return useSyncExternalStore(subscribe, getFilmNav, getFilmNav)
}
