'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Save, RefreshCw, Shield, Gamepad2, Link2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  email: string
  tier: string
  robloxUsername?: string
  profilePicture?: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const [formData, setFormData] = useState({
    robloxUsername: '',
    autoWhitelist: true,
    enableNotifications: true,
  })

  const [robloxValidation, setRobloxValidation] = useState<{
    isValid: boolean
    username: string
    displayName: string
    thumbnail?: string
  } | null>(null)

  const loadUserData = () => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setFormData({
      robloxUsername: parsedUser.robloxUsername || '',
      autoWhitelist: true,
      enableNotifications: true,
    })
    setIsLoading(false)
  }

  useEffect(() => {
    loadUserData()
  }, [router])

  // Validate Roblox username
  const validateRobloxUsername = async (username: string) => {
    if (!username.trim()) {
      setRobloxValidation(null)
      return
    }

    setIsValidating(true)
    try {
      const response = await fetch(`/api/roblox/validate?username=${encodeURIComponent(username)}`)
      const data = await response.json()

      if (response.ok && data.valid) {
        setRobloxValidation({
          isValid: true,
          username: data.username,
          displayName: data.displayName,
          thumbnail: data.thumbnail,
        })
        toast.success('Roblox username validated successfully!')
      } else {
        setRobloxValidation({
          isValid: false,
          username: username,
          displayName: '',
        })
        toast.error('Invalid Roblox username')
      }
    } catch (error) {
      console.error('Validation error:', error)
      setRobloxValidation({
        isValid: false,
        username: username,
        displayName: '',
      })
      toast.error('Failed to validate username')
    } finally {
      setIsValidating(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to continue')
      router.push('/login')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          robloxUsername: formData.robloxUsername,
          autoWhitelist: formData.autoWhitelist,
          enableNotifications: formData.enableNotifications,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings')
      }

      toast.success('Settings saved successfully!')

      // Update local storage
      const updatedUser = {
        ...user,
        robloxUsername: formData.robloxUsername,
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Emit event for real-time update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: updatedUser }))
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="page-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-background min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Settings</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Roblox Username Settings */}
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-900/30 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Roblox Whitelist</CardTitle>
                  <CardDescription className="text-gray-400">
                    Link your Roblox account for seamless integration
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Username */}
              {user?.robloxUsername && (
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-400 text-sm">Current Roblox Username</Label>
                      <p className="text-white font-medium mt-1">{user.robloxUsername}</p>
                    </div>
                    <Badge className="bg-green-900/30 text-green-400 border-green-900/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Linked
                    </Badge>
                  </div>
                </div>
              )}

              {/* Username Input */}
              <div>
                <Label className="text-gray-300">Roblox Username</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter your Roblox username"
                    value={formData.robloxUsername}
                    onChange={(e) => setFormData({ ...formData, robloxUsername: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                  <Button
                    variant="outline"
                    onClick={() => validateRobloxUsername(formData.robloxUsername)}
                    disabled={isValidating || !formData.robloxUsername}
                    className="border-red-900/50 text-red-400 hover:bg-red-950"
                  >
                    {isValidating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Link2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Validate your username to ensure it exists on Roblox
                </p>
              </div>

              {/* Validation Result */}
              {robloxValidation && (
                <div className={`p-4 rounded-lg border ${
                  robloxValidation.isValid
                    ? 'bg-green-900/20 border-green-900/30'
                    : 'bg-red-900/20 border-red-900/30'
                }`}>
                  <div className="flex items-center gap-3">
                    {robloxValidation.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {robloxValidation.isValid
                          ? `Valid: ${robloxValidation.displayName}`
                          : 'Invalid Roblox username'}
                      </p>
                      {robloxValidation.isValid && robloxValidation.username && (
                        <p className="text-xs text-gray-400 mt-1">
                          @ {robloxValidation.username}
                        </p>
                      )}
                    </div>
                    {robloxValidation.thumbnail && (
                      <img
                        src={robloxValidation.thumbnail}
                        alt="Avatar"
                        className="w-12 h-12 rounded-lg"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Auto Whitelist */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                <div className="flex-1">
                  <Label className="text-white">Auto Whitelist</Label>
                  <p className="text-xs text-gray-400 mt-1">
                    Automatically whitelist when joining supported games
                  </p>
                </div>
                <Switch
                  checked={formData.autoWhitelist}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoWhitelist: checked })}
                  className="data-[state=checked]:bg-red-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-900/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Notifications</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your notification preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                <div className="flex-1">
                  <Label className="text-white">Enable Notifications</Label>
                  <p className="text-xs text-gray-400 mt-1">
                    Receive alerts for important updates
                  </p>
                </div>
                <Switch
                  checked={formData.enableNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableNotifications: checked })}
                  className="data-[state=checked]:bg-red-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="border-gray-700 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !robloxValidation?.isValid}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
