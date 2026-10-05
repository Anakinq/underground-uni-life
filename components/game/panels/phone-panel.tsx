import { MessageCircle } from 'lucide-react'
import { messages } from '@/lib/content/messages'

const t = messages.panels.phone

export function PhonePanel() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-heading text-2xl font-bold">{t.title}</h1>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <MessageCircle className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm text-pretty text-muted-foreground">{t.empty}</p>
      </div>
    </div>
  )
}
