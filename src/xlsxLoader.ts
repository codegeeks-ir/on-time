import * as XLSX from 'xlsx'

export type scheduleType = {
  origin: string
  destiny: string
  subSchedule: {
    name: string
    times: string[]
  }[]
  comment?: string  
}

export type repoType = {
  name: string
  link: string
}

export async function loadTimes(repos: repoType[]) {
  let data: scheduleType[] = []
  let offset = 0

  await Promise.all(
    repos.map(async (repo) => {
      try {
        const response = await fetch(repo.link)
        const arrayBuffer = await response.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const csv = XLSX.utils.sheet_to_csv(worksheet, { blankrows: false })
        let rowLen = 0

        csv
          .trim()
          .split('\n')
          .forEach((row, rowIndex) => {
            const rowArr = row.split(',')
            rowLen = rowArr.length

            rowArr.forEach((cell, cellIndex) => {
              if (!cell || cell === '-') return

              const cellValue = cell.trim()

              // If cell starts with '#' treat as a comment
              if (cellValue.startsWith('#')) {
                // find the target schedule for this column
                const target = data[cellIndex + offset]
                if (target) {
                  // append or set the comment field
                  target.comment = (target.comment ? target.comment + '\n' : '') + cellValue.slice(1).trim()
                }
                return
              }

              if (rowIndex === 0) {
                // header cell: create a schedule entry
                const destiny =
                  cellIndex % 2 === 0
                    ? rowArr[cellIndex + 1]
                    : rowArr[cellIndex - 1]
                data.push({
                  origin: cellValue,
                  destiny: (destiny || '').trim(),
                  subSchedule: [],
                })
              } else {
                const target = data[cellIndex + offset]
                if (target) {
                  if (!target.subSchedule || target.subSchedule.length === 0) {
                    target.subSchedule = [{ name: 'پیشفرض', times: [] }]
                  }
                  target.subSchedule[0].times.push(formatTime(cellValue))
                }
              }
            })
          })

        offset += rowLen
        return data
      } catch (error) {
        console.error('Error fetching .xlsx data:', error)
        return null
      }
    })
  )

  data = data.filter(Boolean) as scheduleType[]

  const result: scheduleType[] = []
  const working = [...data]

  for (const item of working) {
    const [title, day] = regexCheck(item.origin)
    const [destinyTitle] = regexCheck(item.destiny)

    if (title) {
      const parentIndex = result.findIndex(
        (base) => base.origin === title && base.destiny === (destinyTitle || item.destiny)
      )

      const subsTimes = item.subSchedule && item.subSchedule[0]?.times
        ? item.subSchedule[0].times
        : []

      if (parentIndex !== -1) {
        result[parentIndex].subSchedule.push({
          name: day || 'پیشفرض',
          times: subsTimes,
        })
        // If item.comment exists, append it to parent comment
        if (item.comment) {
          result[parentIndex].comment = (result[parentIndex].comment || '') + '\n' + item.comment
        }
      } else {
        result.push({
          origin: title,
          destiny: destinyTitle || item.destiny,
          subSchedule: [
            {
              name: day || 'پیشفرض',
              times: subsTimes,
            },
          ],
          comment: item.comment,
        })
      }
    } else {
      const safeSub = item.subSchedule && item.subSchedule.length > 0
        ? item.subSchedule
        : [{ name: 'پیشفرض', times: [] }]

      result.push({
        origin: item.origin,
        destiny: item.destiny,
        subSchedule: safeSub,
        comment: item.comment,
      })
    }
  }

  return result
}

function formatTime(time: string | number) {
  if (typeof time === 'number' && !isNaN(time)) {
    const totalMinutes = Math.round(time * 24 * 60)
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
    const minutes = String(totalMinutes % 60).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const str = String(time).trim()
  if (/^\d{1,2}:\d{2}$/.test(str)) return str
  return str || ''
}

function regexCheck(text: string): [string, string] | [null, null] {
  if (!text) return [null, null]
  const regex = /^(.*)\(([^)]+)\)$/
  const arr = regex.exec(text)
  if (arr) {
    const title = arr[1].trim()
    const word = arr[2].trim()
    return [title, word]
  }
  return [null, null]
}
