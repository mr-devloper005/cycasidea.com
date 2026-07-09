import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  const image = media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
  return image && !image.includes('placeholder.svg') ? image : ''
}
const summaryOf = (post: SitePost) => stripHtml(post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || '').replace(/\s+/g, ' ').trim()

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group block overflow-hidden rounded-xl border border-[#dbe5f2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${strong ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden bg-[#eef5ff] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#2f6bc8]">{taskLabel}</span>
        </div>
      ) : (
        <div className={`flex items-center justify-center bg-[#eef5ff] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <BriefcaseBusiness className="h-14 w-14 text-[#3d73cf]" />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <h2 className="line-clamp-3 text-2xl font-extrabold leading-tight tracking-normal text-[#162033]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-[#657184]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2f6bc8]">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#f7fbff] text-[#162033]">
        <section className="bg-[#d8e7f7] pt-28">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="grid gap-8 rounded-xl border border-[#cbd9ec] bg-white/88 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur md:grid-cols-[0.8fr_1.2fr] lg:p-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3d73cf]">{pagesContent.search.hero.badge}</p>
                <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">{pagesContent.search.hero.title}</h1>
                <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[#657184]">{pagesContent.search.hero.description}</p>
              </div>
              <form action="/search" className="self-end rounded-xl border border-[#dbe5f2] bg-[#f7fbff] p-4 sm:p-5">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-md border border-[#dbe5f2] bg-white px-4 py-3">
                  <Search className="h-5 w-5 text-[#3d73cf]" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-[#8a96a7]" />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-md border border-[#dbe5f2] bg-white px-4 py-3">
                    <Filter className="h-4 w-4 text-[#3d73cf]" />
                    <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#8a96a7]" />
                  </label>
                  <select name="task" defaultValue={task} className="rounded-md border border-[#dbe5f2] bg-white px-4 py-3 text-sm font-bold outline-none">
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </div>
                <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-md bg-[#3d73cf] px-6 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5" type="submit">Search</button>
              </form>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="header" showLabel eager className="mx-auto w-full" />
        </div>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3d73cf]">{results.length} results</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-normal">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/article" className="inline-flex items-center gap-2 rounded-md border border-[#dbe5f2] bg-white px-5 py-3 text-sm font-bold text-[#2f6bc8]">Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-[#dbe5f2] bg-white p-10 text-center">
              <p className="text-2xl font-extrabold tracking-normal">No matching posts found.</p>
              <p className="mt-3 text-sm font-semibold text-[#657184]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="in-feed" showLabel className="mx-auto w-full" />
        </div>
      </main>
    </EditableSiteShell>
  )
}
