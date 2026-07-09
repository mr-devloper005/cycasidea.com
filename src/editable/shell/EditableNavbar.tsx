'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle, UserRound } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Search', href: '/search' },
  ]

  return (
    <header className="sticky top-0 z-50 -mb-[76px] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-md">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3 pr-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/90 transition group-hover:bg-white">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="editable-display block max-w-[200px] truncate text-2xl font-extrabold lowercase leading-none tracking-normal text-white">{SITE_CONFIG.name}</span>
          </span>
        </Link>

        <div className="hidden items-stretch gap-0 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center px-4 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                  active ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
                {active ? <span className="absolute inset-x-3 bottom-0 h-[2px] bg-white" /> : null}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="mx-auto hidden min-w-0 flex-1 justify-center md:flex">
          <label className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 transition focus-within:border-white/60">
            <Search className="h-4 w-4 shrink-0 text-white/80" />
            <input
              name="q"
              type="search"
              placeholder="Search businesses or articles"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/58"
            />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-md border border-white/25 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f6bc8] transition hover:-translate-y-0.5 sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create
              </Link>
              <span className="hidden max-w-[150px] items-center gap-2 truncate rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white sm:inline-flex">
                <UserRound className="h-3.5 w-3.5 shrink-0" /> {session.name || 'Account'}
              </span>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:text-white sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-md border border-white/25 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:border-white hover:text-white sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-md border border-white bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f6bc8] transition hover:-translate-y-0.5 sm:inline-flex"
              >
                <UserPlus className="h-3.5 w-3.5" /> Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-md border border-white/25 bg-white/10 p-2 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[#162033]/96 px-4 py-5 lg:hidden">
          <form action="/search" className="mb-5 flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">
            <Search className="h-4 w-4 text-white/75" />
            <input name="q" type="search" placeholder="Search businesses or articles" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/55" />
          </form>
          {session ? (
            <div className="mb-3 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white">
              {session.name || session.email}
            </div>
          ) : null}
          <div className="grid gap-1">
            {[...navItems, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                    active
                      ? 'border-white bg-white/10 text-white'
                      : 'border-transparent text-white/72 hover:border-white/50 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button type="button" onClick={() => { logout(); setOpen(false) }} className="border-l-2 border-transparent px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-white/72 hover:border-white/50 hover:bg-white/10">
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
