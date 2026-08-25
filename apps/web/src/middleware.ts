// ============================================
// Middleware — i18n routing via next-intl
// Redirects / -> /th or /en based on browser lang
// ============================================
import createMiddleware from 'next-intl/middleware'
import { routing } from './lib/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
