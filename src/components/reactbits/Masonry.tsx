import { useEffect, useState, type ReactNode } from 'react'

interface MasonryItem {
  key: string
  /** Used to balance columns; fall back to 1 when unknown */
  aspectRatio?: number
  node: ReactNode
}

interface MasonryProps {
  items: MasonryItem[]
  className?: string
  /** Column counts at mobile / tablet / desktop */
  columns?: [number, number, number]
  gapClass?: string
}

function useColumnCount(columns: [number, number, number]) {
  const query = () =>
    window.innerWidth >= 1024 ? columns[2] : window.innerWidth >= 640 ? columns[1] : columns[0]
  const [count, setCount] = useState(query)
  useEffect(() => {
    const onResize = () => setCount(query())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns[0], columns[1], columns[2]])
  return count
}

/**
 * ReactBits-style masonry: items are dealt into the currently-shortest column
 * (by cumulative aspect ratio), preserving reading order approximately while
 * keeping columns balanced. Pure CSS columns can't reorder; this can.
 */
export default function Masonry({
  items,
  className = '',
  columns = [2, 3, 4],
  gapClass = 'gap-4',
}: MasonryProps) {
  const count = useColumnCount(columns)

  const cols: MasonryItem[][] = Array.from({ length: count }, () => [])
  const heights = new Array(count).fill(0)
  for (const item of items) {
    const shortest = heights.indexOf(Math.min(...heights))
    cols[shortest].push(item)
    heights[shortest] += 1 / (item.aspectRatio || 1)
  }

  return (
    <div className={`flex ${gapClass} ${className}`}>
      {cols.map((col, i) => (
        <div key={i} className={`flex-1 flex flex-col ${gapClass} min-w-0`}>
          {col.map((item) => (
            <div key={item.key}>{item.node}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
