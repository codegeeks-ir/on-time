import { useState, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ShareBox from './components/ShareBox'
import Timer from './components/Timer'
import './css/style.css'
import Settings from './Settings'
import SelectLocation from './components//SelectLocation'
import AddRepo from './components/AddRepo'
import { loadTimes, type repoType, type scheduleType } from './lib/xlsxLoader'
import useLocalStorage from './hooks/useLocalStorage'
import { base } from './vars'
import { BusFront, Settings as SettingsIcon } from 'lucide-react'
import About from './About'
import FadePage from './components/FadePage'

export const defaultRepo = [{ name: 'دانشگاه صنعتی ارومیه', link: './UUT-BUS.xlsx' }]
export type SettingsType = { format24: boolean; darkMode: boolean }
const defaultSettings: SettingsType = { format24: false, darkMode: false }

function App() {
  const [times, setTimes] = useState<scheduleType[]>([])
  const [prevTimes, setPrevTimes] = useState<scheduleType[]>([])
  const [activeTimer, setActiveTimer] = useLocalStorage<number>('timer', 0)
  const [repos, setRepos] = useLocalStorage<repoType[]>('repos', defaultRepo)
  const [settings, setSettings] = useLocalStorage<SettingsType>('settings', defaultSettings)
  const [loading, setLoading] = useState(true)

  const hue = useMemo(
    () => (times.length > 0 ? Math.round((activeTimer / times.length) * 360) : 0),
    [activeTimer, times.length]
  )

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.darkMode])

  useEffect(() => {
    setLoading(true)
    const minDelay = 500
    const startTime = Date.now()

    async function load() {
      const data = await loadTimes(repos)
      const elapsed = Date.now() - startTime
      const remaining = minDelay - elapsed
      setPrevTimes(times)
      setTimes(data)
      setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0)
    }

    load()
  }, [repos])

  const displayTimes = loading ? prevTimes : times

  return (
    <BrowserRouter>
      <div className={`relative`}>
        {/* Full-screen loading overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'circIn' }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-white text-3xl font-black text-neutral-600"
            >
              <div className="size-24 animate-spin rounded-full border-8 border-neutral-600 border-t-transparent"></div>
              <span>در حال بارگیری</span>
            </motion.div>
          )}
        </AnimatePresence>

        <style>
          {!settings.darkMode
            ? // Light mode Color tweaks
              `
            :root{
              --color-primary: ${`hsl(${hue}, 75%, 60%)`} ;
              --color-darker: ${`hsl(${hue}, 75%, 40%)`};
              --color-alpha: ${`hsl(${hue}, 75%, 60% , 0.1)`};
              --color-header:${`hsl(${hue}, 75%, 60%)`};
            }
          `
            : // Dark Mode color tweaks
              `
              :root{
              --color-primary: ${`hsl(${hue}, 75%, 40%)`} ;
              --color-darker: ${`hsl(${hue}, 75%, 60%)`};
              --color-alpha: ${`hsl(${hue}, 75%, 60% , 0.1)`};
              --color-header:${`hsl(${hue}, 20%, 10%)`};
              }
          `}
        </style>

        {/* Header */}
        <div className="header bg-header relative flex min-h-96 flex-col bg-linear-to-b px-8 py-5 pb-16 transition-all duration-200 ease-in">
          <div className="z-10 flex items-center gap-5 text-white dark:text-neutral-600">
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
                  times={displayTimes}
                  activeTimer={activeTimer}
                  setActiveTimer={setActiveTimer}
                />
              }
            />
          </Routes>
        </div>

        {/* Main content */}
        <div className="min-h-80 -translate-y-7 rounded-3xl bg-white p-8 pb-16 text-center transition-all duration-200 ease-in">
          <Routes>
            <Route
              path={base}
              element={
                displayTimes.length > 0 ? (
                  <Timer timer={displayTimes[activeTimer]} format24={settings.format24} />
                ) : (
                  <p>Loading schedules...</p>
                )
              }
            />
            <Route
              path={`${base}settings`}
              element={
                <FadePage title="تنظیمات">
                  <Settings
                    repos={repos}
                    setRepos={setRepos}
                    setSettings={setSettings}
                    settings={settings}
                  />
                </FadePage>
              }
            />
            <Route
              path={`${base}about`}
              element={
                <FadePage title="راهنما">
                  <About />
                </FadePage>
              }
            />
            <Route
              path={`${base}add`}
              element={
                <FadePage title="افزودن برنامه جدید">
                  <AddRepo repos={repos} setRepos={setRepos} />
                </FadePage>
              }
            />
            <Route
              path={`${base}share`}
              element={
                <FadePage title="به اشتراک گذاری برنامه">
                  <ShareBox url={`${window.location.origin}${base}`} />
                </FadePage>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
