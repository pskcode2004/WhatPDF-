import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { Permanent_Marker } from 'next/font/google'
import { Footer } from '@/components/layout/Footer'
import '../globals.css'

const marker = Permanent_Marker({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-marker'
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })
  return {
    title: `${t('appName')} — ${t('tagline')}`,
    description: t('tagline'),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="stylesheet" href="https://www.apple.com/wss/fonts?families=SF+Pro,v3|SF+Pro+Icons,v3" />
      </head>
      <body className={`antialiased font-sans text-gray-900 ${marker.variable} min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
