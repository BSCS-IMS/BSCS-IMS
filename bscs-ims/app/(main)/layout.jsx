import { Inter } from 'next/font/google'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

const MainLayout = ({ children }) => {
  return <div className={`flex-1 flex flex-col ${inter.variable} antialiased`}>{children}</div>
}

export default MainLayout
