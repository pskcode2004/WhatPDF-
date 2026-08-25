'use client'
import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('common')

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {t('tagline')}
      </h1>
      <p className="text-gray-500 text-lg">{t('fileExpiry')}</p>
    </div>
  )
}
