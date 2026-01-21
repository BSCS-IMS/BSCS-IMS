import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata = {
  title: {
    default: 'Progresio',
    template: '%s · Progresio'
  },
  description:
    'Progresio is an AI-driven workflow and productivity platform that organizes tasks using intensity-based boards to help users prioritize intelligently, prevent overload, and work sustainably.',
  applicationName: 'Progresio',
  keywords: [
    'productivity',
    'workflow',
    'task management',
    'intensity-based boards',
    'AI productivity',
    'workload analysis',
    'burnout prevention'
  ],
  authors: [{ name: 'Progresio Team' }],
  creator: 'Progresio',
  publisher: 'Progresio',
  metadataBase: new URL('https://progesio.vercel.app'),
  openGraph: {
    title: 'Progresio',
    description: 'An intelligent productivity system with embedded AI insights for sustainable work decisions.',
    url: 'https://progesio.vercel.app',
    siteName: 'Progresio',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progresio',
    description: 'Work smarter using intensity-based task boards and AI-driven workload insights.'
  },
  robots: {
    index: true,
    follow: true
  },
  category: 'productivity'
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
