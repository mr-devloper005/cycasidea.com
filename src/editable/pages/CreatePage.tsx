'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Globe2, ImageIcon, Link2, Lock, Send, Tag } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass = 'w-full rounded-lg border border-[#cbd8eb] bg-white px-4 py-3 text-sm font-semibold text-[#17233b] outline-none transition placeholder:text-[#71809a] focus:border-[#2f6bc8] focus:ring-4 focus:ring-[#2f6bc8]/10'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--editable-page-bg,#fff7ee)] px-4 py-16 text-[var(--editable-page-text,#2f1d16)] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-5xl gap-8 rounded-[2.8rem] border border-[var(--editable-border)] bg-white/75 p-7 shadow-[0_30px_90px_rgba(15,23,42,0.08)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div className="flex h-full min-h-72 items-center justify-center rounded-[2rem] bg-[var(--editable-page-text,#2f1d16)] text-[var(--editable-page-bg,#fff7ee)]">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="self-center">
              <p className="text-xs font-black uppercase tracking-[0.28em] opacity-55">{pagesContent.create.locked.badge}</p>
              <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-7xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 opacity-70">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--editable-page-text,#2f1d16)] px-6 py-3 text-sm font-black text-[var(--editable-page-bg,#fff7ee)]">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-6 py-3 text-sm font-black">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--editable-page-bg,#fff7ee)] text-[var(--editable-page-text,#2f1d16)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="overflow-hidden rounded-lg border border-[#cbd8eb] bg-white shadow-[0_24px_70px_rgba(22,49,85,0.12)]">
            <header className="border-b border-[#cbd8eb] bg-[#dceafa] px-6 py-8 sm:px-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#2f6bc8]">{pagesContent.create.hero.badge}</p>
                <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-[#14233d] sm:text-5xl">{pagesContent.create.hero.title}</h1>
                <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-[#52627b]">{pagesContent.create.hero.description}</p>
              </div>
              <div className="mt-5 flex items-center gap-3 text-sm font-bold text-[#14233d] lg:mt-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f6bc8] text-white">{session.name.slice(0, 1).toUpperCase()}</span>
                <span>{session.name}</span>
              </div>
            </header>

            <form onSubmit={submit} className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2f6bc8]">New submission</p>
                  <h2 className="mt-1 text-3xl font-black text-[#14233d]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full bg-[#edf4fd] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#2f6bc8]">{activeTask?.label || 'Post'}</span>
              </div>

              <div className="mt-7 grid gap-6">
                <label className="grid gap-2 text-sm font-bold text-[#263754]">
                  Content type
                  <select className={fieldClass} value={task} onChange={(event) => setTask(event.target.value as TaskKey)}>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#263754]">
                  <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#2f6bc8]" /> Title</span>
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter a clear, descriptive title" required />
                </label>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-[#263754]">
                    <span className="flex items-center gap-2"><Tag className="h-4 w-4 text-[#2f6bc8]" /> Category</span>
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="For example, Technology" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-[#263754]">
                    <span className="flex items-center gap-2"><Link2 className="h-4 w-4 text-[#2f6bc8]" /> Website or source</span>
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-bold text-[#263754]">
                  <span className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-[#2f6bc8]" /> Featured image</span>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Paste an image URL" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#263754]">
                  Short summary
                  <textarea className={`${fieldClass} min-h-28 resize-y`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Give readers a useful overview" required />
                </label>
                <label className="grid gap-2 text-sm font-bold text-[#263754]">
                  <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[#2f6bc8]" /> Main content</span>
                  <textarea className={`${fieldClass} min-h-56 resize-y`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add the full description, details, or article content" required />
                </label>
              </div>

              {created ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#2f6bc8] px-6 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#2459a9] focus:outline-none focus:ring-4 focus:ring-[#2f6bc8]/20">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
