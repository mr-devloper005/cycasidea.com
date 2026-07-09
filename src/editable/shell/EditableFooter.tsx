'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr_0.5fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
            </span>
            <span className="editable-display text-2xl font-extrabold lowercase tracking-normal">{SITE_CONFIG.name}</span>
          </Link>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase text-[#9ac2f0]">Explore</h3>
          <div className="mt-4 grid gap-2">
            <Link href="/" className="text-sm font-bold text-white transition hover:text-white/80">Home</Link>
            <Link href="/about" className="text-sm font-bold text-white transition hover:text-white/80">About</Link>
            <Link href="/contact" className="text-sm font-bold text-white transition hover:text-white/80">Contact</Link>
            <Link href="/search" className="text-sm font-bold text-white transition hover:text-white/80">Search</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase text-[#9ac2f0]">Account</h3>
          <div className="mt-4 grid gap-2">
            {session ? (
              <Link href="/create" className="text-sm font-bold text-white transition hover:text-white/80">Create</Link>
            ) : (
              <>
                <Link href="/signup" className="text-sm font-bold text-white transition hover:text-white/80">Sign up</Link>
                <Link href="/login" className="text-sm font-bold text-white transition hover:text-white/80">Sign in</Link>
              </>
            )}
            {session ? <button type="button" onClick={logout} className="text-left text-sm font-bold text-white transition hover:text-white/80">Logout</button> : null}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase text-[#9ac2f0]">Top</h3>
          <Link href="/" className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-white text-xl font-bold text-[#3d73cf] shadow-sm" aria-label="Back to top">
            ^
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-[var(--editable-container)] border-t border-white/25 px-4 py-6 text-center text-xs font-medium tracking-[0.12em] text-white/76 sm:px-6 lg:px-8">
        COPYRIGHT © {SITE_CONFIG.name.toUpperCase()} :: 2005-{year} :: ALL RIGHTS RESERVED
      </div>
    </footer>
  )
}
