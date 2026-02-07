'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LOGIN_STATIC_DATA } from '@/app/constants/navbar-login/constants'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    try {
      setError(null)
      setIsLoading(true)
      const response = await axios.post('/api/login', {
        email: email.trim(),
        password: password.trim()
      })

      console.log('Login successful:', response.data)
      router.push('/products')
    } catch (err) {
      console.error('Error logging in:', err)
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col'>
      <div className="flex items-center justify-center md:justify-start gap-1 p-5 md:pl-5">
        <Image
          src="/LOGO_CLEAR.png"
          alt="BSCS Logo"
          width={150}
          height={150}
          className="object-contain"
          priority
        />

        <h1 className="text-3xl md:text-4xl font-bold text-[#5A67BA]">
          {LOGIN_STATIC_DATA.APP_NAME}
        </h1>
      </div>

      <div className='flex-1 flex items-center justify-center px-4 pb-30'>
        <div className='w-full max-w-xl'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl font-semibold text-[#5A67BA] mb-3'>{LOGIN_STATIC_DATA.WELCOME_TITLE}</h2>
            <p className='text-gray-600 text-base'>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-3'>
              <Label htmlFor='email' className='text-[#5A67BA] text-base'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='h-14 text-base'
                required
              />
            </div>

            <div className='space-y-3'>
              <Label htmlFor='password' className='text-[#5A67BA] text-base'>
                Password
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='h-14 text-base pr-12'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                >
                  {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                </button>
              </div>
            </div>

            {error && <p className='text-red-500 text-base text-center bg-red-50 py-3 px-4 rounded-md'>{error}</p>}

            <Button
              type='submit'
              className='cursor-pointer w-full h-14 text-base bg-[#5A67BA] hover:bg-[#293582] text-white font-medium mt-8'
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>

      <div className='p-8 text-center md:text-right md:pr-16'>
        <p className='text-[#5A67BA] text-sm'>{LOGIN_STATIC_DATA.LOGIN_FOOTER}</p>
      </div>
    </div>
  )
}