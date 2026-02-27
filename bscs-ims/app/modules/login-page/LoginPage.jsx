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
import { toast } from 'react-toastify'
import { LoginLoader } from '@/app/components/Loader'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation with toast errors
    if (!email.trim() && !password.trim()) {
      toast.error('Please enter your email and password', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
      return
    }

    if (!email.trim()) {
      toast.error('Please enter your email address', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
      return
    }

    if (!validateEmail(email.trim())) {
      toast.error('Please enter a valid email address', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
      return
    }

    if (!password.trim()) {
      toast.error('Please enter your password', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
      return
    }

    if (password.trim().length < 6) {
      toast.error('Password must be at least 6 characters', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
      return
    }

    try {
      setIsLoading(true)
      
      const response = await axios.post('/api/login', {
        email: email.trim(),
        password: password.trim()
      })

      // Success toast
      toast.success('Login Successfull, Welcome!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      })

      // Artificial delay for better UX (1.5 seconds)
      setTimeout(() => {
        router.push('/products')
      }, 1500)

    } catch (err) {
      console.error('Error logging in:', err)
      setIsLoading(false)

      // Error toast with user-friendly message
      toast.error('Incorrect email or password. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
    }
  }

  return (
    <>
      {isLoading && <LoginLoader />}
      
      <div className='min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col'>
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 p-4 md:pl-16 mt-10">

          <Image
            src="/LOGO_CLEAr.png"
            alt="Murang Bigas Logo"
            width={45}
            height={45}
            className="object-contain"
            priority
          />

          <h1 className="text-lg md:text-xl font-semibold text-[#1F384C] text-center md:text-left">
            {LOGIN_STATIC_DATA.APP_NAME}
          </h1>

        </div>

        <div className='flex-1 flex items-center justify-center px-4 pb-16'>
          <div className='w-full max-w-md'>
            <div className='text-center mb-6'>
              <h2 className='text-2xl font-medium text-gray-900 mb-2'>{LOGIN_STATIC_DATA.WELCOME_TITLE}</h2>
              <p className='text-gray-600 text-sm'>Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5' noValidate>
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-gray-900 text-sm'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='h-11 text-sm'
                  disabled={isLoading}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password' className='text-gray-900 text-sm'>
                  Password
                </Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='h-11 text-sm pr-10'
                    disabled={isLoading}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
              </div>

              <Button
                type='submit'
                className='cursor-pointer w-full h-11 text-sm bg-[#1F384C] hover:opacity-99 text-white font-medium mt-6'
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </div>

        <div className='p-6 text-center md:text-right md:pr-16'>
          <p className='text-[#1F384C] text-xs'>{LOGIN_STATIC_DATA.LOGIN_FOOTER}</p>
        </div>
      </div>
    </>
  )
}