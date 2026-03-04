'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <h1 className="text-[180px] font-bold text-[#1F384C] opacity-10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-[#1F384C]">
                Page Not Found
              </h2>
              <p className="text-gray-600 text-sm">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.push('/login')}
          className="cursor-pointer h-11 px-8 text-sm bg-[#1F384C] hover:opacity-90 text-white font-medium transition-opacity"
        >
          Back to Login
        </Button>
      </div>
    </div>
  )
}
