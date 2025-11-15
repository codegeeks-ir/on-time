import { Link } from 'react-router-dom'
import Repo from './components/Repo'
import type { repoType } from './lib/xlsxLoader'
import { defaultRepo, type SettingsType } from './App'
import { base } from './vars'
import { HelpCircle, Plus, RefreshCw, Share2 } from 'lucide-react'

type props = {
  repos: repoType[]
  setRepos: React.Dispatch<React.SetStateAction<repoType[]>>
  settings: SettingsType
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>
}

export default function Settings({ repos, setRepos, settings, setSettings }: props) {
  function remove(link: string) {
    const newRepos = repos.filter((item) => {
      return item.link !== link
    })
    setRepos(newRepos)
  }

  function resetProgram() {
    const RuSureAboutDat = confirm(`آیا از بازنشانی برنامه‌ها مطمئن هستید؟`)
    if (RuSureAboutDat) setRepos(defaultRepo)
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <h2>برنامه‌های زمانی فعال:</h2>
        <div className="flex flex-col gap-3">
          {repos.map((item) => {
            return (
              <Repo
                link={item.link}
                remove={remove}
                disabled={repos.length === 1}
                name={item.name}
                key={item.link}
              />
            )
          })}
          <div className="mt-3 flex justify-center gap-4 text-sm">
            <Link to={`${base}add`} className="glass-button selected flex items-center gap-1">
              <Plus />
              افزودن برنامه جدید
            </Link>
            <button
              type="button"
              className="glass-button flex items-center gap-2 bg-neutral-500/10"
              onClick={resetProgram}
            >
              <RefreshCw />
              بازنشانی
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4 text-lg">
        <div className="rtl flex items-center">
          <input
            id="overwrite"
            type="checkbox"
            name="overwrite"
            checked={settings.format24}
            onChange={() => {
              setSettings((old) => {
                const newSettings = { ...old }
                newSettings.format24 = !old.format24
                return newSettings
              })
            }}
            className="checked:bg-primary checked:border-primary size-5 cursor-pointer appearance-none rounded border border-gray-400 transition-all"
          />
          <label htmlFor="overwrite" className="ms-2 text-gray-900">
            استفاده از فرمت زمانی ۲۴ ساعته
          </label>
        </div>
        <div className="rtl flex items-center">
          <input
            id="darkMode"
            type="checkbox"
            name="darkMode"
            checked={settings.darkMode}
            onChange={() => {
              setSettings((old) => {
                const newSettings = { ...old }
                console.log(old.darkMode)
                newSettings.darkMode = old.darkMode ? !old.darkMode : true
                return newSettings
              })
            }}
            className="checked:bg-primary checked:border-primary size-5 cursor-pointer appearance-none rounded border border-gray-400 transition-all"
          />

          <label htmlFor="darkMode" className="ms-2 text-gray-900">
            حالت شب
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <Link
          to={`${base}share`}
          className="glass-button flex items-center gap-3 bg-neutral-500/10 p-5"
        >
          <Share2 />
          به اشتراک گذاری برنامه
        </Link>
        <Link to={`${base}about`} className="glass-button selected flex items-center gap-3 p-5">
          <HelpCircle />
          راهنمای برنامه
        </Link>
      </div>
    </>
  )
}
