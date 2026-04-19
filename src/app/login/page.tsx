'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from './actions'
import { toast } from 'sonner'
import { Loader2, Command } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await login(formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white font-sans antialiased">
      {/* Minimal Left Side - Text only */}
      <div className="hidden lg:flex flex-col justify-between w-[40%] p-16 border-r border-gray-100">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Command className="w-5 h-5" />
          <span>CRM.CORE</span>
        </div>
        
        <div className="max-w-sm">
          <h1 className="text-5xl font-bold tracking-tight leading-[1.1] mb-6">
            Enterprise intelligence, <br />
            simplified.
          </h1>
          <p className="text-gray-500 leading-relaxed">
            The professional standard for managing customer relationships and sales pipelines with absolute precision.
          </p>
        </div>

        <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">
          &copy; 2026 CRM.CORE
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-[380px] space-y-12">
          <div className="space-y-4">
            <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-12">
              <Command className="w-5 h-5" />
              <span>CRM.CORE</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
            <p className="text-gray-500 text-sm">
              Enter your credentials to access the enterprise dashboard.
            </p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-5">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</Label>
                  <Link href="#" className="text-xs text-gray-400 hover:text-black transition-colors">
                    Forgot?
                  </Link>
                </div>
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
              Access Dashboard
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400">
            Internal system for authorized personnel only.{' '}
            <Link href="#" className="text-black font-bold hover:underline">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
