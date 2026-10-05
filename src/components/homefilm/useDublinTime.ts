import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat('en-IE', {
  timeZone: 'Europe/Dublin',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/** Local time in Dublin, refreshed on the minute. */
export function useDublinTime(): string {
  const [now, setNow] = useState(() => fmt.format(new Date()))
  useEffect(() => {
    let timer = 0
    const schedule = () => {
      const ms = 60_000 - (Date.now() % 60_000) + 50
      timer = window.setTimeout(() => {
        setNow(fmt.format(new Date()))
        schedule()
      }, ms)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [])
  return now
}
