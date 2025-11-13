import React, { useEffect, useMemo, useState } from 'react'
import type { scheduleType } from './xlsxLoader'
import { ArrowUpDown } from 'lucide-react'
type Props = {
  times: scheduleType[]
  activeTimer: number
  setActiveTimer: React.Dispatch<React.SetStateAction<number>>
}

export default function SelectLocation({ times, activeTimer, setActiveTimer }: Props) {
  const tree = useMemo(() => {
    const map = new Map<string, { destiny: string; id: number }[]>()
    times.forEach((t, i) => {
      const origin = t.origin ?? ''
      const leaf = { destiny: t.destiny ?? '', id: i }
      if (!map.has(origin)) map.set(origin, [])
      map.get(origin)!.push(leaf)
    })
    return map
  }, [times])

  const [selectedOrigin, setSelectedOrigin] = useState<string>('')
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null)

  useEffect(() => {
    if (times[activeTimer]) {
      setSelectedOrigin(times[activeTimer].origin)
      setSelectedScheduleId(activeTimer)
      return
    }
    const it = tree.keys().next()
    if (!it.done) {
      const origin = it.value
      setSelectedOrigin(origin)
      const leaves = tree.get(origin) ?? []
      setSelectedScheduleId(leaves.length ? leaves[0].id : null)
    } else {
      setSelectedOrigin('')
      setSelectedScheduleId(null)
    }
  }, [activeTimer, times, tree])

  function handleOriginChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const origin = e.target.value
    setSelectedOrigin(origin)

    const leaves = tree.get(origin) ?? []
    if (leaves.length) {
      setSelectedScheduleId(leaves[0].id)
      setActiveTimer(leaves[0].id)
    } else {
      setSelectedScheduleId(null)
    }
  }

  function handleDestinationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const raw = e.target.value
    const id = raw === '' ? null : Number(raw)
    setSelectedScheduleId(id)
    if (id != null) setActiveTimer(id)
  }

  function handleReverse() {
    const curOrigin = selectedOrigin
    const curDest = selectedScheduleId != null ? (times[selectedScheduleId]?.destiny ?? '') : ''

    if (!curOrigin) return

    const found = times.findIndex((t) => t.origin === curDest && t.destiny === curOrigin)
    if (found !== -1) {
      setSelectedOrigin(times[found].origin)
      setSelectedScheduleId(found)
      setActiveTimer(found)
      return
    }

    // not found: swap the UI fields so user sees swapped pair; do NOT force parent to an invalid index
    setSelectedOrigin(curDest)
    setSelectedScheduleId(null)
  }

  const hasNoData = times.length === 0 || tree.size === 0
  const destinationsForSelectedOrigin = selectedOrigin ? (tree.get(selectedOrigin) ?? []) : []

  return (
    <div className="rtl z-10 mx-auto mt-5 flex w-full max-w-screen-sm flex-col items-center justify-around gap-5 rounded-2xl bg-white p-5 text-sm">
      <div className="flex w-full flex-col gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-gray-500">مبدا</label>
          <select
            className="mt-1 block w-full rounded-lg bg-neutral-100 p-3 focus:outline-1"
            value={selectedOrigin}
            onChange={handleOriginChange}
            disabled={hasNoData}
          >
            {hasNoData ? <option value="">مبدا موجود نیست</option> : null}
            {Array.from(tree.keys()).map((origin) => (
              <option key={origin} value={origin}>
                {origin}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleReverse}
          className="selected mt-2 flex justify-center rounded-md border p-4"
          title="تعویض مبدا با مقصد"
        >
          <ArrowUpDown size={18} /> &nbsp;
          <span>تعویض مبدا با مقصد</span>
        </button>

        <div className="flex-1">
          <label className="mb-1 block text-sm text-gray-500">مقصد</label>
          <select
            className="mt-1 block w-full rounded-lg bg-neutral-100 p-3 focus:outline-1"
            value={selectedScheduleId ?? ''}
            onChange={handleDestinationChange}
            disabled={hasNoData || !selectedOrigin}
          >
            {(!selectedOrigin || destinationsForSelectedOrigin.length === 0) && (
              <option value="">مقصد موجود نیست</option>
            )}
            {destinationsForSelectedOrigin.map((leaf) => (
              <option key={leaf.id} value={leaf.id}>
                {leaf.destiny}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
