// here is where you input providers

import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ConditionalLayout } from "../components/ui/conditional-layout"


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata = {
  title: {
    default: 'EUGENE IMS',
    template: '%s · EUGENE IMS'
  },
  description:
    'EUGENE IMS is an integrated inventory management system designed for rice businesses to streamline tracking, reseller management, and dynamic price updates across web, desktop, and mobile platforms.',
  applicationName: 'EUGENE IMS',
  keywords: [
    'inventory management',
    'rice business',
    'reseller tracking',
    'price updates',
    'IMS',
    'stock management',
    'multi-platform',
    'workflow automation'
  ],
  authors: [{ name: 'EUGENE IMS Team' }],
  creator: 'EUGENE IMS Team',
  publisher: 'EUGENE IMS Team',
  metadataBase: new URL('https://your-deployment-url.vercel.app'), 
  openGraph: {
    title: 'EUGENE IMS',
    description:
      'A multi-platform inventory management system for rice businesses, simplifying reseller contact, stock tracking, and price management.',
    url: 'https://your-deployment-url.vercel.app', 
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EUGENE IMS',
    description: 'Manage rice inventory, reseller contacts, and pricing seamlessly on web, desktop, and mobile.'
  },
  robots: {
    index: true,
    follow: true
  },
  category: 'inventory management'
}


export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${inter.variable} antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
        <Analytics />
      </body>
    </html>
  )
}

// export default function RootLayout({ children }) {
//   return (
//     <html lang='en'>
//       <body className={`${inter.variable} antialiased`}>
//         {children}
//         <Analytics />
//       </body>
//     </html>
//   )
// }
