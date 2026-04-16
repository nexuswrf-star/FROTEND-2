'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Shield, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const passwordStrength = formData.password.length > 0 ? (
    formData.password.length >= 8 &&
    /[A-Z]/.test(formData.password) &&
    /[a-z]/.test(formData.password) &&
    /[0-9]/.test(formData.password)
  ) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!passwordStrength) {
      toast.error('Password does not meet requirements')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Registration successful! Please login.')
      router.push('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-background min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Create account</CardTitle>
          <CardDescription className="text-gray-400">
            Join Beulrock SS today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    {formData.password.length >= 8 ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-gray-500" />
                    )}
                    <span className={formData.password.length >= 8 ? 'text-green-500' : 'text-gray-500'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {/[A-Z]/.test(formData.password) ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-gray-500" />
                    )}
                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'}>
                      Uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {/[a-z]/.test(formData.password) ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-gray-500" />
                    )}
                    <span className={/[a-z]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'}>
                      Lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {/[0-9]/.test(formData.password) ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-gray-500" />
                    )}
                    <span className={/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'}>
                      Number
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Link href="/login" className="text-red-500 hover:text-red-400 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
