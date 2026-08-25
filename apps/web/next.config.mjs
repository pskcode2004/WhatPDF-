import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@whatpdf/shared'],
  experimental: {
    serverComponentsExternalPackages: ['ioredis', 'bullmq'],
  },
}

export default withNextIntl(nextConfig)
