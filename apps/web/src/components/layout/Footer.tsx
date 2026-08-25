'use client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer() {
  const t = useTranslations('common')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Copyright */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-marker text-gray-800">WhatPDF?</span>
            <span className="text-sm text-gray-500">
              © {currentYear} — {t('freeForever', { fallback: '100% Free Forever' })}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-brand-600 transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="hover:text-brand-600 transition-colors">
              {t('terms')}
            </Link>
            <a 
              href="mailto:pskcode2004@gmail.com" 
              className="hover:text-brand-600 transition-colors"
            >
              {t('contact')}
            </a>
            <a 
              href="https://github.com/pskcode2004" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors"
            >
              GitHub
            </a>
          </div>

        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          {t('autoDeleteNotice', { fallback: 'All uploaded files are automatically deleted after 24 hours for your privacy.' })}
        </div>
      </div>
    </footer>
  )
}
