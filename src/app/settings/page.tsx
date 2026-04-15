'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Shield, 
  User, 
  Bell, 
  Lock,
  Globe,
  Trash2,
  Save,
  Download,
  Upload,
  Key,
  HelpCircle
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Profile settings
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    discord: ''
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    discordNotifications: true,
    updateAlerts: true,
    securityAlerts: true
  })

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // API settings
  const [apiSettings, setApiSettings] = useState({
    apiKey: '',
    webhookUrl: ''
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setProfileData({
      username: parsedUser.username || '',
      email: parsedUser.email || '',
      discord: ''
    })
    
    // Mock API key
    setApiSettings({
      apiKey: 'sk-' + Math.random().toString(36).substring(2, 15),
      webhookUrl: ''
    })

    setIsLoading(false)
  }

  const handleSaveProfile = () => {
    // Mock save profile
    toast.success('Profile updated successfully!')
  }

  const handleChangePassword = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (securityData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    // Mock change password
    toast.success('Password changed successfully!')
    setSecurityData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleRegenerateApiKey = () => {
    const newKey = 'sk-' + Math.random().toString(36).substring(2, 15)
    setApiSettings({ ...apiSettings, apiKey: newKey })
    toast.success('API key regenerated!')
  }

  const handleExportData = () => {
    const userData = {
      profile: profileData,
      settings: {
        notifications,
        apiSettings
      },
      exportedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'beulrock-data.json'
    link.click()
    toast.success('Data exported successfully!')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/')
      toast.success('Account deleted successfully')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-red-950">
      {/* Navbar */}
      <nav className="border-b border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <Shield className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-xl font-bold text-white">Settings</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 w-full justify-start">
            <TabsTrigger value="profile" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Key className="w-4 h-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="danger" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Trash2 className="w-4 h-4 mr-2" />
              Danger Zone
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Profile Settings</CardTitle>
                <CardDescription className="text-gray-400">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Username</Label>
                    <Input
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Discord Username (Optional)</Label>
                  <Input
                    placeholder="username#0000"
                    value={profileData.discord}
                    onChange={(e) => setProfileData({ ...profileData, discord: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Account Information</CardTitle>
                <CardDescription className="text-gray-400">Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
                  <span className="text-gray-400">User ID</span>
                  <span className="text-white font-mono">{user?.id || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
                  <span className="text-gray-400">Account Type</span>
                  <span className="text-white capitalize">{user?.role || 'User'}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
                  <span className="text-gray-400">Member Since</span>
                  <span className="text-white">January 2024</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-gray-400">Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Discord Notifications</p>
                    <p className="text-sm text-gray-400">Receive alerts via Discord</p>
                  </div>
                  <Switch
                    checked={notifications.discordNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, discordNotifications: checked })}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Update Alerts</p>
                    <p className="text-sm text-gray-400">Get notified about new features</p>
                  </div>
                  <Switch
                    checked={notifications.updateAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, updateAlerts: checked })}
                  />
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Security Alerts</p>
                    <p className="text-sm text-gray-400">Get notified about security events</p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, securityAlerts: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Change Password</CardTitle>
                <CardDescription className="text-gray-400">Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Current Password</Label>
                  <Input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">New Password</Label>
                  <Input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Active Sessions</CardTitle>
                <CardDescription className="text-gray-400">Manage your active sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                    <div>
                      <p className="font-medium text-white">Current Session</p>
                      <p className="text-sm text-gray-400">Chrome on Windows • Active now</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-900/30">
                      Current
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                    <div>
                      <p className="font-medium text-white">Chrome on Mobile</p>
                      <p className="text-sm text-gray-400">Last active 2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-red-900/50 text-red-400 hover:bg-red-950">
                      Revoke
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">API Key</CardTitle>
                <CardDescription className="text-gray-400">Your personal API key for integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">API Key</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={apiSettings.apiKey}
                      readOnly
                      className="bg-gray-800/50 border-gray-700 text-white font-mono"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(apiSettings.apiKey)
                        toast.success('API key copied!')
                      }}
                      className="border-red-900/50 text-red-400 hover:bg-red-950"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleRegenerateApiKey}
                  variant="outline"
                  className="border-red-900/50 text-red-400 hover:bg-red-950"
                >
                  Regenerate API Key
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Webhook URL</CardTitle>
                <CardDescription className="text-gray-400">Configure webhook for notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Discord Webhook URL</Label>
                  <Input
                    placeholder="https://discord.com/api/webhooks/..."
                    value={apiSettings.webhookUrl}
                    onChange={(e) => setApiSettings({ ...apiSettings, webhookUrl: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <Button
                  onClick={() => toast.success('Webhook URL saved!')}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  Save Webhook
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger" className="space-y-6">
            <Card className="border-red-900/50 bg-red-950/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Export Data</CardTitle>
                <CardDescription className="text-gray-400">Download all your account data</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="border-red-900/50 text-red-400 hover:bg-red-950"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-900/50 bg-red-950/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-red-400">Delete Account</CardTitle>
                <CardDescription className="text-gray-400">
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-red-900/20 border border-red-900/50">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                      <p className="font-medium text-white mb-2">Warning: This action cannot be undone!</p>
                      <p>Deleting your account will permanently remove all your data including scripts, settings, and activity logs. This action is irreversible.</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-950 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
                <CardDescription className="text-gray-400">Contact support if you have any issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-red-900/50 text-red-400 hover:bg-red-950"
                    onClick={() => window.open('https://discord.gg/beulrock', '_blank')}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Join Discord Support
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-900/50 text-red-400 hover:bg-red-950"
                    onClick={() => window.open('mailto:support@beulrock.com', '_self')}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
