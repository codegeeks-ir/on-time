import { CopyIcon, Share2 } from 'lucide-react'
import { useState } from 'react'
import QRCode from 'react-qr-code'

export default function ShareBox({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const copyText = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const share = () => {
    if (navigator.share) {
      navigator.share({
        url: url,
        text: '🚌 لینک ابزار آن-تایم برای اطلاع از آخرین زمان حرکت سرویس‌ها 👇\n\n',
      })
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 rounded-xl bg-neutral-50 p-5">
      <QRCode value={url} size={250} bgColor="transparent" fgColor="var(--color-neutral-900)" />

      <div className="flex w-full flex-col flex-wrap items-center justify-between gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className="ltr w-3/4 rounded border border-neutral-400 bg-neutral-500/10 p-3 px-3 text-sm text-neutral-600"
        />
        <button
          onClick={() => copyText()}
          className="flex items-center justify-center gap-2 rounded border border-neutral-400 bg-neutral-500/10 p-2 text-sm text-neutral-600"
        >
          <CopyIcon />
          {copied ? 'کپی شد!' : 'کپی لینک'}
        </button>
      </div>
      <div className="flex gap-3">
        <button onClick={() => share()} className="glass-button selected flex gap-1">
          <Share2 />
          به اشتراک گذاری
        </button>
      </div>
    </div>
  )
}
