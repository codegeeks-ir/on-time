// TODO: better error handling and loading management
// TODO: use custom hooks for storing persistent data (like settings and repos) for better readability

import { useState, useMemo } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Timer from './Timer'
import './style.css'
import Settings from './Settings'
import { useEffect } from 'react'
import SelectLocation from './SelectLocation'
import { loadTimes, type repoType, type scheduleType } from './xlsxLoader'
import AddRepo from './AddRepo'
import { base } from './vars'
import { BusFront, Settings as SettingsIcon } from 'lucide-react'
import { startTransition } from './startTransition'
export const defaultRepo = [
  {
    name: 'دانشگاه صنعتی ارومیه',
    link: './UUT-BUS.xlsx',
  },
]

export type SettingsType = {
  format24: boolean
}

const defaultSettings = {
  format24: false,
} as SettingsType

function App() {
  const [times, setTimes] = useState<scheduleType[]>([])
  const [activeTimer, setactiveTimer] = useState(0)

  const [repos, setrepos] = useState((): repoType[] => {
    const data = localStorage.getItem('repos')
    if (data) {
      return JSON.parse(data)
    }
    return defaultRepo
  })

  const [settings, setSettings] = useState((): SettingsType => {
    const data = localStorage.getItem('settings')
    if (data) {
      return JSON.parse(data)
    }
    return defaultSettings
  })

  const hue = useMemo(() => {
    if (times.length > 0) return Math.round((activeTimer / times.length) * 360)
    else return 0
  }, [activeTimer, times.length])

  useEffect(() => {
    async function load() {
      const data = await loadTimes(repos)
      setTimes(data)
    }
    localStorage.setItem('repos', JSON.stringify(repos))
    load()
    setactiveTimer(0)
  }, [repos])

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
  }, [settings])

  const css = `.header{min-height:100px;!important;view-transition-name:header;}`
  return (
    <BrowserRouter>
      <div>
        <style>
          {`
              :root{
                --color-primary: ${`hsl(${hue}, 75%, 60%)`} ;
                --color-darker: ${`hsl(${hue}, 75%, 40%)`};
                --color-alpha: ${`hsl(${hue}, 75%, 60% , 0.1)`};
              }
            `}
        </style>
        <div className="header bg-primary relative flex min-h-96 flex-col bg-gradient-to-b px-8 py-5 pb-16 transition duration-200 ease-in">
          <div className="z-10 flex items-center gap-5 text-white">
            <div>
              <Link to={base} className="flex flex-col items-center gap-2 text-xs no-underline">
                <BusFront size={32} />
                <h1 className="font-bold">صفحه اصلی</h1>
              </Link>
            </div>

            <div className="ml-auto">
              <Link
                to={`${base}settings`}
                className="flex flex-col items-center gap-2 text-xs no-underline"
              >
                <SettingsIcon size={32} />
                <p className="font-bold">تنظیمات</p>
              </Link>
            </div>
          </div>
          <Routes>
            <Route
              path={base}
              element={
                <SelectLocation
                  times={times}
                  activeTimer={activeTimer}
                  setActiveTimer={setactiveTimer}
                />
              }
            />
            <Route
              path={`${base}settings`}
              element={
                <div className="relative h-full text-center text-white">
                  <style>{css}</style>
                </div>
              }
            />
          </Routes>
        </div>
        <div className="min-h-80 -translate-y-7 rounded-3xl bg-white p-8 pb-16 text-center">
          <Routes>
            <Route
              path={base}
              element={
                times && times.length > 0 ? (
                  <Timer timer={times[activeTimer]} format24={settings.format24} />
                ) : (
                  <h2>برنامه‌ای برای نمایش وجود ندارد</h2>
                )
              }
            />
            <Route
              path={`${base}settings`}
              element={
                <Settings
                  repos={repos}
                  setRepos={setrepos}
                  setSettings={setSettings}
                  settings={settings}
                />
              }
            />
            <Route
              path={`${base}add`}
              element={
                <>
                  {' '}
                  <style>{css}</style>
                  <AddRepo repos={repos} setRepos={setrepos} />
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
