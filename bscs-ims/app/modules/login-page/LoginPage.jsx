'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LOGIN_STATIC_DATA } from '@/app/constants/navbar-login/constants'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      <div className='p-8 md:p-16 text-center md:text-left'>
        <h1 className='text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent'>
          {LOGIN_STATIC_DATA.APP_NAME}
        </h1>
      </div>

      <div className='flex-1 flex items-center justify-center px-4 pb-30'>
        <div className='w-full max-w-md'>
          <div className='text-center mb-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-2'>{LOGIN_STATIC_DATA.WELCOME_TITLE}</h2>
            <p className='text-gray-600 text-sm'>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-gray-700'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='h-11'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='text-gray-700'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='h-11'
                required
              />
            </div>

            {error && <p className='text-red-500 text-sm text-center bg-red-50 py-2 px-3 rounded-md'>{error}</p>}

            <Button
              type='submit'
              className='cursor-pointer w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium mt-6'
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>

      <div className='p-8 text-center md:text-right md:pr-16'>
        <p className='text-gray-500 text-sm'>{LOGIN_STATIC_DATA.LOGIN_FOOTER}</p>
      </div>
    </div>
  )
}
