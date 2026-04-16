'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Activity, 
  Users, 
  Clock, 
  Gamepad2, 
  Shield, 
  Copy, 
  LogOut, 
  Zap,
  TrendingUp,
  CheckCircle,
  XCircle,
  Lock
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  username: string
  tier: string
  id: string
  role: string
}

interface DashboardData {
  user: User
  whitelist: {
    tier: string
    active: boolean
    expiresAt: Date | null
  } | null
  stats: {
    executions: number
    daysActive: number
    whitelistTier: string
    referrals: number
    balance: string
  }
  recentActivity: {
    id: string
    action: string
    game: string
    time: string
    status: string
  }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [redeemKey, setRedeemKey] = useState('')
  const [isRedeeming, setIsRedeeming] = useState(false)

  const [quickPicks, setQuickPicks] = useState([
    { id: 1, title: 'Dark Dex', description: 'Advanced decompiler', verified: true },
    { id: 2, title: 'Remote Spy', description: 'Monitor events', verified: true },
    { id: 3, title: 'Auto Farm', description: 'Automated farming', verified: false },
  ])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      setUser(JSON.parse(userData))
      setIsLoading(true)

      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout()
          return
        }
        throw new Error('Failed to load dashboard')
      }

      const data = await response.json()
      setDashboardData(data.data)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyReferralLink = () => {
    const link = `https://beulrock.com/ref/${user?.id || 'user'}`
    navigator.clipboard.writeText(link)
    toast.success('Referral link copied!')
  }

  const handleRedeemKey = async () => {
    if (!redeemKey.trim()) {
      toast.error('Please enter a key')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to continue')
      router.push('/login')
      return
    }

    setIsRedeeming(true)

    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code: redeemKey.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to redeem key')
      }

      toast.success(data.message || 'Key redeemed successfully!')
      setRedeemKey('')
      
      // Refresh dashboard data
      await loadDashboardData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to redeem key')
    } finally {
      setIsRedeeming(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
    toast.success('Logged out successfully')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || {
    executions: 0,
    daysActive: 0,
    whitelistTier: 'Basic',
    referrals: 0,
    balance: '0.00'
  }

  const recentActivity = dashboardData?.recentActivity || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-red-950">
      {/* Navbar */}
      <nav className="border-b border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Beulrock SS</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-sm text-white font-medium">{user?.username}</span>
                {user?.tier && (
                  <Badge className="ml-2 bg-red-900/30 text-red-400 border-red-900/30 text-xs">
                    {user.tier}
                  </Badge>
                )}
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-red-900/50 text-red-400 hover:bg-red-950">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Whitelist Tier</CardTitle>
              <Shield className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.whitelistTier}</div>
              <p className="text-xs text-gray-500 mt-1">Active subscription</p>
            </CardContent>
          </Card>

          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Executions</CardTitle>
              <Activity className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.executions}</div>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Days Active</CardTitle>
              <Clock className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.daysActive}</div>
              <p className="text-xs text-gray-500 mt-1">Since registration</p>
            </CardContent>
          </Card>

          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Referrals</CardTitle>
              <Users className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.referrals}</div>
              <p className="text-xs text-gray-500 mt-1">${stats.balance} earned</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Picks */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Quick Picks</CardTitle>
                <CardDescription className="text-gray-400">Popular scripts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickPicks.map((script) => (
                    <div
                      key={script.id}
                      className="p-4 rounded-lg border border-gray-800 bg-gray-800/50 hover:border-red-900/50 transition-all cursor-pointer"
                      onClick={() => {
                        toast.info(`Loading ${script.title}...`)
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{script.title}</h3>
                        {script.verified && (
                          <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-900/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{script.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Logs */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Your recent actions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {recentActivity.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">No recent activity</p>
                      </div>
                    ) : (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-gray-800/50">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.status === 'success' ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                            {activity.status === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{activity.action}</p>
                            <p className="text-xs text-gray-400">{activity.game} • {activity.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Popular Games */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Popular Games</CardTitle>
                    <CardDescription className="text-gray-400">Most played games</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/games')}
                    className="border-red-900/50 text-red-400 hover:bg-red-950"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Blox Fruits', players: '15.4K' },
                    { name: 'Pet Simulator 99', players: '8.9K' },
                    { name: 'Brookhaven RP', players: '45K' },
                    { name: 'Da Hood', players: '12K' },
                  ].map((game, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-gray-800 bg-gray-800/50 hover:border-red-900/50 transition-all cursor-pointer"
                      onClick={() => router.push('/games')}
                    >
                      <p className="text-sm font-medium text-white mb-1">{game.name}</p>
                      <p className="text-xs text-gray-400 flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {game.players} players
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Referral Program */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Referral Program</CardTitle>
                <CardDescription className="text-gray-400">Earn rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300 text-sm">Your Referral Link</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={`https://beulrock.com/ref/${user?.id || 'user'}`}
                      readOnly
                      className="bg-gray-800/50 border-gray-700 text-white text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyReferralLink}
                      className="border-red-900/50 text-red-400 hover:bg-red-950"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Separator className="bg-gray-800" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-800/50">
                    <p className="text-2xl font-bold text-white">{stats.referrals}</p>
                    <p className="text-xs text-gray-400">Total Referrals</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-800/50">
                    <p className="text-2xl font-bold text-white">${stats.balance}</p>
                    <p className="text-xs text-gray-400">Balance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Redeem Key */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Redeem Key</CardTitle>
                <CardDescription className="text-gray-400">Upgrade your tier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300 text-sm">License Key</Label>
                  <Input
                    placeholder="Enter your key"
                    value={redeemKey}
                    onChange={(e) => setRedeemKey(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <Button
                  onClick={handleRedeemKey}
                  disabled={isRedeeming}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  {isRedeeming ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Redeeming...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Redeem Key
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/games')}
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Browse Games
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/scripts')}
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Script Library
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/executor')}
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Open Executor
                </Button>
                {user?.role === 'admin' && (
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/admin')}
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => router.push('/obfuscator')}
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Code Obfuscator
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
