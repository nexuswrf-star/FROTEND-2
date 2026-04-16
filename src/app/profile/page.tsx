'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Camera, Lock, Mail, Shield, Save, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  email: string
  tier: string
  role: string
  robloxUsername?: string
  profilePicture?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    profilePicture: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const loadUserData = () => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setProfileData({
      profilePicture: parsedUser.profilePicture || '',
    })
    setIsLoading(false)
  }

  useEffect(() => {
    loadUserData()
  }, [router])

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('File size must be less than 2MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfileData({ ...profileData, profilePicture: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
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
          profilePicture: profileData.profilePicture,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      toast.success('Profile updated successfully!')

      // Update local storage
      const updatedUser = {
        ...user,
        profilePicture: profileData.profilePicture,
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields')
      return
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to continue')
      router.push('/login')
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      toast.success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="page-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
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
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Profile</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => router.push('/settings')}
                className="text-gray-400 hover:text-white"
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your profile and account details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-gray-700">
                    <AvatarImage src={profileData.profilePicture || user?.profilePicture} alt={user?.username} />
                    <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-white text-2xl">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-600 hover:bg-red-700"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{user?.username}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-red-900/30 text-red-400 border-red-900/30">
                      {user?.tier}
                    </Badge>
                    <Badge className={user?.role?.toLowerCase() === 'admin' ? 'bg-purple-900/30 text-purple-400 border-purple-900/30' : 'bg-gray-800 text-gray-400 border-gray-700'}>
                      {user?.role}
                    </Badge>
                  </div>
                  {user?.robloxUsername && (
                    <p className="text-sm text-gray-400 mt-2">
                      Roblox: <span className="text-red-400">{user.robloxUsername}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Mail className="w-4 h-4" />
                    <Label className="text-sm">Email</Label>
                  </div>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Shield className="w-4 h-4" />
                    <Label className="text-sm">Account Type</Label>
                  </div>
                  <p className="text-white font-medium">{user?.tier} {user?.role}</p>
                </div>
              </div>

              {/* Save Profile Button */}
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving || profileData.profilePicture === (user?.profilePicture || '')}
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
                    Save Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-900/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Change Password</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your account password
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Current Password</Label>
                <div className="relative mt-2">
                  <Input
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">New Password</Label>
                <div className="relative mt-2">
                  <Input
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Confirm New Password</Label>
                <div className="relative mt-2">
                  <Input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white pr-10"
                  />
                  {passwordData.newPassword && passwordData.confirmPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {passwordData.newPassword === passwordData.confirmPassword ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="text-red-500 text-xs">Mismatch</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                {isChangingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
