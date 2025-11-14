import { base, origin } from '../vars'
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
    <div className="flex flex-wrap items-center justify-around gap-3 rounded border-neutral-400 bg-neutral-100 p-5 text-sm shadow">
      <label htmlFor={name}>{name}</label>
      <input
        id={name}
        type="text"
        value={link}
        readOnly
        className="ltr accent-primary grow overflow-hidden rounded bg-neutral-50 p-3"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleShare(name, link)}
          className="flex h-8 w-8 items-center justify-center rounded border text-neutral-400"
        >
          <ExternalLink size={20} />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded border border-red-500 text-red-500 disabled:opacity-20"
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
