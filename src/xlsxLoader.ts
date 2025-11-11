// TODO: better error handling and notify the user if the file is corrupted/invalid format
// TODO: sort the times and only allow valid time formats
// TODO: check for bugs in sheetsJs and counter for injections
import * as XLSX from 'xlsx'

export type scheduleType = {
  origin: string
  destiny: string
  times: string[]
  subSchedule: {
    name: string
    times: string[]
  }[]
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

        // Convert to CSV
        const csv = XLSX.utils.sheet_to_csv(worksheet, { blankrows: false })
        let rowLen = 0
        csv
          .trim()
          .split('\n')
          .forEach((row, rowIndex) => {
            row.split(',').forEach((cell, cellIndex, rowArr) => {
              rowLen = rowArr.length

              if (cell && rowIndex === 0) {
                const destiny = cellIndex % 2 === 0 ? rowArr[cellIndex + 1] : rowArr[cellIndex - 1]
                data.push({
                  origin: cell.trim(),
                  destiny: destiny.trim(),
                  times: [],
                  subSchedule: [],
                })
              } else if (cell && cell !== '-') {
                data[cellIndex + offset].times.push(formatTime(cell))
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

  data = data.filter((item) => {
    // check if the schedule is day-specific
    const [title, day] = regexCheck(item.origin)
    const [destinyTitle] = regexCheck(item.destiny)
    if (title) {
      // find and append the data as subschedule to the proper schedule
      const index = data.findIndex((item) => {
        return item.origin === title && item.destiny === destinyTitle
      })
      data[index].subSchedule.push({ name: day, times: item.times })
      return false
    }
    return true
  })

  // Filter out any null results due to errors
  return data.filter(Boolean)
}

// Helper function to format time strings to HH:MM
function formatTime(time: string) {
  if (typeof time === 'number') {
    const totalMinutes = Math.round(time * 24 * 60)
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
    const minutes = String(totalMinutes % 60).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  return time
}

function regexCheck(text: string): [string, string] | [null, null] {
  const regex = /^(.*)\((شنبه|یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنجشنبه|جمعه)\)$/
  const arr = regex.exec(text)
  if (arr != null) {
    const title = arr[1].trim()
    const day = arr[2].trim()
    return [title, day]
  } else return [null, null]
}
