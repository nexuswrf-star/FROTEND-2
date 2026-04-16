'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Zap,
  Star,
  Crown,
  Copy,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface WhitelistedGame {
  id: string
  name: string
  status: 'active' | 'pending' | 'revoked'
  whitelistedAt: string
  expiresAt: string
}

export default function WhitelistPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userTier, setUserTier] = useState<'basic' | 'premium' | 'ultimate'>('premium')
  const [expiryDays, setExpiryDays] = useState(45)
  const [whitelistedGames, setWhitelistedGames] = useState<WhitelistedGame[]>([])
  const [redeemKey, setRedeemKey] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadWhitelistData()
  }, [])

  const loadWhitelistData = () => {
    // Mock whitelist data
    const mockGames: WhitelistedGame[] = [
      { id: '1', name: 'Blox Fruits', status: 'active', whitelistedAt: '2024-02-01', expiresAt: '2024-03-17' },
      { id: '2', name: 'Pet Simulator 99', status: 'active', whitelistedAt: '2024-02-05', expiresAt: '2024-03-21' },
      { id: '3', name: 'Da Hood', status: 'pending', whitelistedAt: '2024-02-10', expiresAt: '2024-03-27' },
    ]

    setWhitelistedGames(mockGames)
    setIsLoading(false)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setTimeout(() => {
      loadWhitelistData()
      setIsRefreshing(false)
      toast.success('Whitelist status refreshed!')
    }, 1000)
  }

  const handleCopyWhitelistId = () => {
    const userId = localStorage.getItem('user')
    if (userId) {
      const user = JSON.parse(userId)
      navigator.clipboard.writeText(user.id.toString())
      toast.success('Whitelist ID copied!')
    }
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

    setIsRefreshing(true)

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

      // Refresh whitelist data
      await loadWhitelistData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to redeem key')
    } finally {
      setIsRefreshing(false)
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'ultimate':
        return <Crown className="w-6 h-6" />
      case 'premium':
        return <Star className="w-6 h-6" />
      default:
        return <Shield className="w-6 h-6" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'ultimate':
        return 'from-yellow-600 to-yellow-700'
      case 'premium':
        return 'from-red-600 to-red-700'
      default:
        return 'from-gray-600 to-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="page-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading whitelist...</p>
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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <Shield className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-xl font-bold text-white">Whitelist Management</h1>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-red-900/50 text-red-400 hover:bg-red-950"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Whitelist Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Tier Card */}
            <Card className="border-red-900/30 bg-gradient-to-br from-red-900/20 to-gray-900/50 backdrop-blur-xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-600/20 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getTierColor(userTier)} flex items-center justify-center text-white`}>
                      {getTierIcon(userTier)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white capitalize">{userTier} Tier</h2>
                      <p className="text-gray-400">Your current whitelist status</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-900/30 text-green-400 border-green-900/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-800/50">
                    <p className="text-sm text-gray-400 mb-1">Expires In</p>
                    <p className="text-xl font-bold text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-red-400" />
                      {expiryDays} Days
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/50">
                    <p className="text-sm text-gray-400 mb-1">Games Whitelisted</p>
                    <p className="text-xl font-bold text-white">{whitelistedGames.length}</p>
                  </div>
                </div>

                {/* Tier Benefits */}
                <div className="space-y-2">
                  <h3 className="font-medium text-white">Tier Benefits</h3>
                  {userTier === 'ultimate' ? (
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Unlimited game access</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Priority support</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Early access features</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 90-day whitelist duration</li>
                    </ul>
                  ) : userTier === 'premium' ? (
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 50+ games supported</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Regular updates</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Email support</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 45-day whitelist duration</li>
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 10 games supported</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Basic features</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> 30-day whitelist duration</li>
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Whitelisted Games */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Whitelisted Games</CardTitle>
                <CardDescription className="text-gray-400">Games with active whitelist</CardDescription>
              </CardHeader>
              <CardContent>
                {whitelistedGames.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">No games whitelisted yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {whitelistedGames.map((game) => (
                      <div key={game.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg ${game.status === 'active' ? 'bg-green-900/30' : game.status === 'pending' ? 'bg-yellow-900/30' : 'bg-red-900/30'} flex items-center justify-center`}>
                            {game.status === 'active' ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : game.status === 'pending' ? (
                              <Clock className="w-5 h-5 text-yellow-400" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{game.name}</p>
                            <p className="text-xs text-gray-400">
                              {game.status === 'active' ? 'Expires: ' + game.expiresAt : 'Processing...'}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={game.status === 'active' ? 'default' : 'secondary'}
                          className={
                            game.status === 'active'
                              ? 'bg-green-900/30 text-green-400 border-green-900/30'
                              : game.status === 'pending'
                              ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900/30'
                              : 'bg-red-900/30 text-red-400 border-red-900/30'
                          }
                        >
                          {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Whitelist ID */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Your Whitelist ID</CardTitle>
                <CardDescription className="text-gray-400">Use this ID for support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Whitelist ID</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={JSON.parse(localStorage.getItem('user') || '{}').id || 'N/A'}
                      readOnly
                      className="bg-gray-800/50 border-gray-700 text-white"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyWhitelistId}
                      className="border-red-900/50 text-red-400 hover:bg-red-950"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Redeem Key */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Upgrade Tier</CardTitle>
                <CardDescription className="text-gray-400">Redeem a license key</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">License Key</Label>
                  <Input
                    placeholder="Enter your key"
                    value={redeemKey}
                    onChange={(e) => setRedeemKey(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <Button
                  onClick={handleRedeemKey}
                  disabled={isRefreshing}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  {isRefreshing ? (
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

            {/* Support */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-red-900/50 text-red-400 hover:bg-red-950"
                  onClick={() => window.open('https://discord.gg/beulrock', '_blank')}
                >
                  Join Discord
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-900/50 text-red-400 hover:bg-red-950"
                  onClick={() => router.push('/settings')}
                >
                  Open Support Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
