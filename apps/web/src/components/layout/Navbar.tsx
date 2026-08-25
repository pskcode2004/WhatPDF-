'use client'
import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/lib/i18n/routing'

export function Navbar() {
  const locale = useLocale()
  const pathname = usePathname()

  const otherLocale = locale === 'th' ? 'en' : 'th'

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[28px] font-marker text-[#2962ff]">WhatPDF?</span>
        </Link>

        {/* Language switcher */}
        <Link
          href={pathname}
          locale={otherLocale}
          className="text-sm text-gray-500 hover:text-gray-900 font-medium px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {locale.toUpperCase()}
        </Link>
      </div>
    </nav>
  )
}
