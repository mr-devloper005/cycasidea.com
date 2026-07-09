import Link from 'next/link'
import {
  BriefcaseBusiness, Check, ChevronRight, Globe2,
  MapPin, Search, Star, UsersRound,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8'

const cities = [
  ['ZA', 'Cape Town', 'Western Cape'], ['US', 'New York City', 'New York'], ['CA', 'Toronto', 'Ontario'], ['PH', 'Manila', 'Metro Manila'], ['GB', 'London', 'England'],
  ['US', 'Los Angeles', 'California'], ['ZA', 'Durban', 'KwaZulu-Natal'], ['US', 'Chicago', 'Illinois'], ['ZA', 'Johannesburg', 'Gauteng'], ['CA', 'Montreal', 'Quebec'],
  ['ZA', 'Soweto', 'Gauteng'], ['AR', 'Buenos Aires', 'Buenos Aires'], ['IN', 'Mumbai', 'Maharashtra'], ['MX', 'Mexico City', 'Mexico City'], ['PK', 'Karachi', 'Sindh'],
  ['IN', 'Delhi', 'Delhi'], ['TR', 'Istanbul', 'Istanbul Province'], ['BD', 'Dhaka', 'Dhaka Division'], ['KR', 'Seoul', 'Seoul'], ['BR', 'Sao Paulo', 'Sao Paulo'],
]

const countries = [
  ['ZA', 'South Africa'], ['US', 'United States'], ['CA', 'Canada'], ['PH', 'Philippines'], ['GB', 'United Kingdom'],
  ['IN', 'India'], ['PK', 'Pakistan'], ['NG', 'Nigeria'], ['ET', 'Ethiopia'], ['MM', 'Myanmar'],
  ['CN', 'China'], ['ID', 'Indonesia'], ['BR', 'Brazil'], ['BD', 'Bangladesh'], ['RU', 'Russia'],
  ['JP', 'Japan'], ['MX', 'Mexico'], ['KE', 'Kenya'], ['UG', 'Uganda'], ['NP', 'Nepal'],
]

function cleanText(value = '', limit = 150) {
  const text = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text
}

function getContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function excerpt(post?: SitePost | null, limit = 140) {
  const content = getContent(post)
  const raw = post?.summary || (typeof content.description === 'string' ? content.description : '') || (typeof content.excerpt === 'string' ? content.excerpt : '')
  return cleanText(raw, limit)
}

function category(post?: SitePost | null, fallback = 'Directory') {
  const content = getContent(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
}

function safeImage(post?: SitePost | null) {
  const image = getEditablePostImage(post)
  return image && !image.includes('placeholder.svg') ? image : ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function latestImages(posts: SitePost[]) {
  return posts.map((post) => safeImage(post)).filter(Boolean).slice(0, 8)
}

function ratingSeed(post: SitePost) {
  const key = post.slug || post.id || post.title || 'cycasidea'
  let h = 0
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return (4.1 + (h % 8) / 10).toFixed(1)
}

function Stars() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[#2f6bc8]">
      {[0, 1, 2, 3, 4].map((item) => <Star key={item} className="h-3.5 w-3.5 fill-current" />)}
    </span>
  )
}

export function EditableHomeHero({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const images = latestImages(pool)

  return (
    <section className="bg-white">
      <div className="relative h-[610px] overflow-hidden bg-[#d9e8f7] sm:h-[690px] lg:h-[720px]">
        <EditableHeroCollage images={images} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.15),transparent_26%),linear-gradient(90deg,rgba(3,22,28,0.66),rgba(24,33,30,0.32),rgba(32,29,18,0.46))]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-black/48 backdrop-blur-sm" />
        <div className={`${container} relative flex h-full items-center justify-center pt-20`}>
          <div className="w-full max-w-[1024px] rounded-md bg-black/48 px-5 py-7 text-center text-white shadow-[0_28px_80px_rgba(0,0,0,0.25)] backdrop-blur-[2px] sm:px-8">
            <h1 className="text-balance text-3xl font-extrabold tracking-normal sm:text-4xl lg:text-[42px]">The Online Global Business Directory</h1>
            <p className="mt-5 text-base font-medium">Search for businesses, services, articles, and useful local information on {SITE_CONFIG.name}.</p>
            <form action="/search" className="mx-auto mt-5 grid max-w-[980px] overflow-hidden rounded-md bg-white text-left shadow-lg md:grid-cols-[1fr_1.65fr_92px]">
              <label className="flex min-h-14 items-center border-b border-[#d8dfe8] px-4 text-sm font-semibold text-[#2f6bc8] md:border-b-0 md:border-r">
                Business
                <ChevronRight className="ml-auto h-4 w-4 rotate-90" />
              </label>
              <label className="flex min-h-14 items-center gap-3 border-b border-[#d8dfe8] px-4 md:border-b-0 md:border-r">
                <input name="q" className="min-w-0 flex-1 bg-transparent text-sm text-[#253041] outline-none placeholder:text-[#6d7685]" placeholder="Business, article, category, or service" />
                <input name="location" className="hidden min-w-0 flex-1 border-l border-[#d8dfe8] bg-transparent pl-4 text-sm text-[#253041] outline-none placeholder:text-[#6d7685] sm:block" placeholder="Current Location" />
              </label>
              <button className="flex min-h-14 items-center justify-center bg-white text-[#2f6bc8] transition hover:bg-[#f1f6ff]" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail(_props: HomeSectionProps) {
  return (
    <section className="bg-[#d8e7f7] py-20 sm:py-28">
      <div className={`${container} grid items-center gap-9 lg:grid-cols-[0.95fr_1fr]`}>
        <div className="rounded-xl border border-white bg-white/72 p-3 shadow-sm">
          <div className="rounded-lg bg-white px-8 py-8 text-center">
            <h2 className="text-3xl font-bold leading-tight text-[#3d73cf]">Business &<br />Location Intelligence</h2>
            <p className="mx-auto mt-5 max-w-md text-xl leading-8 text-[#17202d]">Access useful business listings, postal codes, city data, and practical articles from one trusted directory surface.</p>
            <p className="mx-auto mt-5 max-w-sm text-lg leading-8 text-[#17202d]">Built for professionals, researchers, students, businesses, and customers.</p>
          </div>
        </div>
        <div className="cycas-tilt-card overflow-hidden rounded-md border-4 border-[#3d73cf] bg-white p-1 shadow-xl">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[linear-gradient(135deg,#0f3670,#2d84d8_48%,#071e3e)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(255,255,255,0.9),transparent_7%),linear-gradient(180deg,transparent,rgba(2,17,38,0.68))]" />
            <div className="absolute inset-x-8 bottom-10 h-24 rounded-[50%] bg-[#f9b44d]/45 blur-xl" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 px-8">
              {[56, 88, 132, 96, 148, 112, 76, 126, 92].map((height, index) => (
                <span key={index} className="block w-8 rounded-t-sm bg-white/70 shadow-[0_0_28px_rgba(255,255,255,0.34)]" style={{ height }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedCard({ post, href }: { post: SitePost; href: string }) {
  const image = safeImage(post)
  return (
    <Link href={href} className="group grid overflow-hidden rounded-xl border border-[#dbe5f2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[1.05fr_1fr]">
      <div className="relative min-h-[280px] bg-[#d8e7f7]">
        {image ? <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <BriefcaseBusiness className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-[#3d73cf]" />}
      </div>
      <div className="p-7 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3d73cf]">Featured insight</p>
        <h3 className="mt-4 text-3xl font-bold leading-tight text-[#162033]">{post.title}</h3>
        <p className="mt-4 text-base leading-7 text-[#5f6876]">{excerpt(post, 190)}</p>
        <div className="mt-5 flex items-center gap-2"><Stars /><span className="text-sm font-semibold text-[#1c2b44]">{ratingSeed(post)}</span></div>
      </div>
    </Link>
  )
}

function CompactCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex gap-4 rounded-lg border border-[#dbe5f2] bg-white p-4 transition hover:-translate-y-1 hover:border-[#3d73cf] hover:shadow-lg">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#eef5ff] text-xl font-bold text-[#2f6bc8]">{String(index + 1).padStart(2, '0')}</span>
      <span className="min-w-0">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7685]">{category(post, 'Article')}</span>
        <strong className="mt-1 line-clamp-2 block text-base leading-snug text-[#152033] group-hover:text-[#2f6bc8]">{post.title}</strong>
        <span className="mt-2 line-clamp-2 block text-sm leading-6 text-[#697586]">{excerpt(post, 95)}</span>
      </span>
    </Link>
  )
}

function HorizontalCard({ post, href }: { post: SitePost; href: string }) {
  const image = safeImage(post)
  return (
    <Link href={href} className="group grid overflow-hidden rounded-lg border border-[#dbe5f2] bg-white transition hover:-translate-y-1 hover:shadow-lg sm:grid-cols-[170px_1fr]">
      <div className="relative min-h-36 bg-[#eef5ff]">
        {image ? <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <Globe2 className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-[#3d73cf]" />}
      </div>
      <div className="p-5">
        <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-bold text-[#2f6bc8]">{category(post)}</span>
        <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-tight text-[#162033]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#697586]">{excerpt(post, 120)}</p>
      </div>
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  const image = safeImage(post)
  return (
    <Link href={href} className="group block overflow-hidden rounded-xl border border-[#dbe5f2] bg-white transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] bg-[#eef5ff]">
        {image ? <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <UsersRound className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-[#3d73cf]" />}
        <span className="absolute left-4 top-4 rounded bg-white/95 px-3 py-1 text-xs font-bold text-[#2f6bc8]">{category(post)}</span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-xl font-bold leading-tight text-[#162033]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#697586]">{excerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 12)
  if (!pool.length) return null
  const [first, ...rest] = pool

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className={`${container}`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="cycas-tilt-card order-2 overflow-hidden rounded-md border-[3px] border-[#8b008b] bg-white p-2 shadow-lg lg:order-1">
            <div className="flex aspect-[16/10] items-end justify-center bg-[linear-gradient(180deg,#ffffff,#f7fbff)] px-8 pb-7">
              <div className="flex items-end gap-3">
                {[82, 108, 92, 128, 118, 142, 104].map((height, index) => (
                  <span key={index} className="w-12 rounded-t-full bg-[linear-gradient(180deg,#253b64,#f28c56)]" style={{ height }} />
                ))}
              </div>
            </div>
          </div>
          <div className="relative order-1 rounded-3xl bg-[linear-gradient(100deg,#ead3ec,#d5e4f8)] p-8 text-center lg:order-2 lg:-rotate-[-2deg]">
            <h2 className="text-3xl font-bold text-[#3d73cf]">Manage Your Free Listing!</h2>
            <p className="mt-4 text-xl text-[#162033]">Take control of your business profile today.</p>
            <p className="mx-auto mt-4 max-w-lg text-xl leading-8 text-[#162033]">Connect with more customers and keep accurate information easy to find.</p>
            <Link href="/create" className="mt-5 inline-flex items-center gap-3 rounded-lg border border-[#c9ced8] bg-white px-5 py-2 text-lg font-bold text-[#3d73cf] shadow-sm transition hover:-translate-y-0.5">
              <Check className="h-6 w-6 text-[#00a65a]" /> Claim Your Business
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#3d73cf]">Latest from {SITE_CONFIG.name}</p>
              <h2 className="mt-2 text-3xl font-bold text-[#162033]">Listings and articles worth opening</h2>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {first ? <FeaturedCard post={first} href={postHref(primaryTask, first, primaryRoute)} /> : null}
            <div className="grid gap-4">
              {rest.slice(0, 4).map((post, index) => <CompactCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {rest.slice(4, 8).map((post) => <HorizontalCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function DirectoryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="relative mx-auto max-w-[990px] rounded-md border-2 border-[#edf0f4] bg-white px-5 pb-7 pt-9">
      <h2 className="absolute -top-7 left-10 inline-flex items-center gap-2 bg-white px-3 text-2xl font-bold text-[#3d73cf]">
        <MapPin className="h-9 w-9 fill-[#3d73cf] text-[#3d73cf]" /> {title}
      </h2>
      {children}
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(8, 16)

  return (
    <>
      <section className="bg-[linear-gradient(90deg,#bfd5ec,#d5efe8,#c8f1ff)] py-20 sm:py-28">
        <div className={`${container} grid items-center gap-10 lg:grid-cols-[0.95fr_1fr]`}>
          <div className="rounded-xl border border-white bg-white/72 p-3 shadow-sm">
            <div className="rounded-lg bg-white px-8 py-8 text-center">
              <h2 className="text-3xl font-bold text-[#3d73cf]">About {SITE_CONFIG.name}</h2>
              <p className="mx-auto mt-5 max-w-md text-xl leading-8 text-[#17202d]">Our purpose is to make business and location information easier to browse, compare, and use.</p>
              <p className="mx-auto mt-5 max-w-md text-xl leading-8 text-[#17202d]">Articles and listings sit together so readers can move from research to action.</p>
              <Link href="/about" className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#c7cbd2] bg-white px-4 py-2 text-lg font-bold text-[#3d73cf] shadow-sm">
                <UsersRound className="h-5 w-5 text-[#a763e6]" /> Meet the Directory
              </Link>
            </div>
          </div>
          <div className="cycas-tilt-card overflow-hidden rounded-md border-4 border-[#3d73cf] bg-white p-1 shadow-xl">
            <div className="relative flex aspect-[16/10] items-center justify-center bg-[linear-gradient(135deg,#f6f8fb,#dfe6ef)]">
              <Globe2 className="h-36 w-36 text-[#3d73cf]" />
              <div className="absolute inset-10 rounded-full border border-[#aebed0]" />
              <div className="absolute inset-x-12 top-1/2 h-px bg-[#bac7d5]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className={`${container} space-y-20`}>
          <DirectoryBlock title="Major Cities">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {cities.map(([code, city, region]) => (
                <Link key={`${code}-${city}`} href={`/search?q=${encodeURIComponent(city)}`} className="flex min-h-12 items-center rounded border border-[#cbd0d6] bg-[#fbfbfc] px-2 text-[#1f5fb5] transition hover:border-[#3d73cf] hover:bg-[#f1f6ff]">
                  <span className="mr-2 text-3xl font-medium">{code}</span>
                  <span className="min-w-0 leading-tight"><span className="block truncate text-base">{city}</span><span className="block truncate text-xs text-[#89919d]">{region}</span></span>
                </Link>
              ))}
            </div>
          </DirectoryBlock>

          <DirectoryBlock title="Countries">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {countries.map(([code, country]) => (
                <Link key={`${code}-${country}`} href={`/search?q=${encodeURIComponent(country)}`} className="flex min-h-9 items-center rounded border border-[#cbd0d6] bg-[#fbfbfc] px-3 text-[#1f5fb5] transition hover:border-[#3d73cf] hover:bg-[#f1f6ff]">
                  <span className="mr-3 text-sm font-medium">{code}</span>
                  <span className="truncate text-base">{country}</span>
                </Link>
              ))}
            </div>
            <div className="-mb-11 mt-5 flex justify-center">
              <Link href="/search" className="inline-flex items-center gap-2 rounded-md border border-[#cbd0d6] bg-white px-4 py-2 text-sm font-bold text-[#2f6bc8] shadow-sm">
                <Search className="h-4 w-4" /> Browse More...
              </Link>
            </div>
          </DirectoryBlock>

          {pool.length ? (
            <div>
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#3d73cf]">Discovery rail</p>
                  <h2 className="mt-2 text-3xl font-bold text-[#162033]">More businesses, guides, and useful reads</h2>
                </div>
                <Link href={primaryRoute} className="text-sm font-bold text-[#2f6bc8] hover:underline">See all</Link>
              </div>
              <div className="cycas-slider -mx-4 flex gap-5 overflow-hidden px-4 py-2">
                {[...pool, ...pool].map((post, index) => (
                  <div key={`${post.id || post.slug}-${index}`} className="w-[280px] shrink-0">
                    <ImageFirstCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return null
}
