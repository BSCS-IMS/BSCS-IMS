'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import axios from 'axios'

export default function ErrorPage() {
  const router = useRouter()

  const handleBackToLogin = async () => {
    try {
      await axios.post('/api/logout')
    } catch (error) {
      console.error('Error clearing token:', error)
    } finally {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#1F384C] opacity-10 absolute -top-2 -left-2"></div>
            <span className="text-9xl font-bold text-[#1F384C] relative z-10">4</span>
          </div>

          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-[#1F384C] flex items-center justify-center bg-white shadow-lg">
              <span className="text-5xl font-bold text-[#1F384C]">0</span>
            </div>
            <div className="w-20 h-20 rounded-full bg-[#1F384C] opacity-5 absolute -bottom-4 -right-4"></div>
          </div>

          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#1F384C] opacity-10 absolute -top-2 -right-2"></div>
            <span className="text-9xl font-bold text-[#1F384C] relative z-10">4</span>
          </div>
        </div>

        <div className="space-y-3 mb-10">
          <h2 className="text-3xl font-semibold text-[#1F384C]">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-base max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <Button
          onClick={handleBackToLogin}
          className="h-12 px-10 text-sm bg-transparent border-2 border-[#1F384C] text-[#1F384C] hover:bg-[#1F384C] hover:text-white font-medium transition-all rounded-lg hover:cursor-pointer"
        >
          Back to Login
        </Button>
      </div>
    </div>
  )
}
