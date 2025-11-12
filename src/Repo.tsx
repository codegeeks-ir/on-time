import { base, origin } from './vars'
import { ExternalLink, Trash } from 'lucide-react'
type props = {
  name: string
  link: string
  remove: (a: string) => void
  disabled: boolean
}
export default function Repo({ name, link, remove, disabled }: props) {
  function handleShare(name: string, link: string) {
    const url = `${origin + base}add?name=${name}&link=${link}&rm=true`
    navigator.clipboard.writeText(encodeURI(url))
    alert('آدرس اشتراک گذاری این برنامه با موفقیت کپی شد!')
  }
  return (
    <div className="flex flex-wrap items-center justify-around gap-3 rounded border-zinc-400 bg-zinc-100 p-5 text-sm shadow">
      <label htmlFor={name}>{name}</label>
      <input
        id={name}
        type="text"
        value={link}
        readOnly
        className="ltr flex-grow overflow-hidden rounded p-2"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleShare(name, link)}
          className="flex h-8 w-8 items-center justify-center rounded bg-zinc-500 text-white"
        >
          <ExternalLink size={20} />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded bg-red-700 text-white disabled:opacity-50"
          disabled={disabled}
          onClick={() => {
            const RuSureAboutDat = confirm(`آیا از حذف برنامه «${name}» مطمئن هستید؟`)
            if (RuSureAboutDat) {
              remove(link)
            }
          }}
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  )
}
