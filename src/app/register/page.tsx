'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { register } from './actions'
import { toast } from 'sonner'
import { Loader2, Command } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await register(formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Registration successful. Please login.')
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white font-sans antialiased">
      {/* Minimal Left Side */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] p-16 border-r border-gray-100">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Command className="w-5 h-5" />
          <span>CRM.CORE</span>
        </div>
        
        <div className="max-w-sm">
          <h1 className="text-5xl font-bold tracking-tight leading-[1.1] mb-6">
            The first step <br />
            to mastery.
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Register as the organization owner to begin your journey with the world's most precise CRM.
          </p>
        </div>

        <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">
          &copy; 2026 CRM.CORE
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-[380px] space-y-12">
          <div className="space-y-4">
            <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-12">
              <Command className="w-5 h-5" />
              <span>CRM.CORE</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
            <p className="text-gray-500 text-sm">
              The first user to register will automatically become the **Owner**.
            </p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</Label>
                <Input 
                  id="full_name" 
                  name="full_name" 
                  placeholder="John Doe" 
                  required 
                  className="h-11 rounded-none border-0 border-b border-gray-200 px-0 shadow-none focus-visible:ring-0 focus-visible:border-black transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  required 
                  className="h-11 rounded-none border-0 border-b border-gray-200 px-0 shadow-none focus-visible:ring-0 focus-visible:border-black transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="h-11 rounded-none border-0 border-b border-gray-200 px-0 shadow-none focus-visible:ring-0 focus-visible:border-black transition-all"
                />
              </div>
            </div>

            <Button className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-none transition-all font-bold text-sm uppercase tracking-widest" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Organization
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-black font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
