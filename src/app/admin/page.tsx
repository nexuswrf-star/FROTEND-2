'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Users, 
  Key, 
  Activity, 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  Copy,
  Shield,
  Zap,
  CheckCircle,
  Download,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  tier: 'basic' | 'premium' | 'ultimate'
  status: 'active' | 'banned' | 'suspended'
  createdAt: string
  lastActive: string
}

interface LicenseKey {
  id: number
  key: string
  tier: 'basic' | 'premium' | 'ultimate'
  createdBy: string
  createdAt: string
  status: 'active' | 'used' | 'expired'
}

interface ActivityLog {
  id: number
  userId: number
  username: string
  action: string
  details: string
  timestamp: string
  ip: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('overview')

  // Mock data
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalKeys: 0,
    todayActivity: 0
  })

  const [users, setUsers] = useState<User[]>([])
  const [keys, setKeys] = useState<LicenseKey[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [newKeyTier, setNewKeyTier] = useState<'basic' | 'premium' | 'ultimate'>('premium')

  const loadAdminData = () => {
    // Mock users data
    const mockUsers: User[] = [
      { id:1, username: 'admin', email: 'admin@beulrock.com', role: 'admin', tier: 'ultimate', status: 'active', createdAt: '2024-01-01', lastActive: '2 min ago' },
      { id: 2, username: 'beulrock', email: 'user@beulrock.com', role: 'user', tier: 'premium', status: 'active', createdAt: '2024-01-15', lastActive: '5 min ago' },
      { id: 3, username: 'demo_user', email: 'demo@test.com', role: 'user', tier: 'basic', status: 'active', createdAt: '2024-02-01', lastActive: '1 hour ago' },
      { id: 4, username: 'john_doe', email: 'john@test.com', role: 'user', tier: 'premium', status: 'active', createdAt: '2024-02-10', lastActive: '30 min ago' },
      { id: 5, username: 'suspended_user', email: 'bad@test.com', role: 'user', tier: 'basic', status: 'suspended', createdAt: '2024-01-20', lastActive: '3 days ago' },
    ]

    // Mock keys data
    const mockKeys: LicenseKey[] = [
      { id: 1, key: 'PREMIUM-2024-XXXX', tier: 'premium', createdBy: 'admin', createdAt: '2024-02-15', status: 'active' },
      { id: 2, key: 'ULTIMATE-2024-YYYY', tier: 'ultimate', createdBy: 'admin', createdAt: '2024-02-14', status: 'used' },
      { id: 3, key: 'BASIC-2024-ZZZZ', tier: 'basic', createdBy: 'admin', createdAt: '2024-02-13', status: 'active' },
    ]

    // Mock activity logs
    const mockActivities: ActivityLog[] = [
      { id: 1, userId: 2, username: 'beulrock', action: 'Login', details: 'Successful login from 192.168.1.1', timestamp: '2 min ago', ip: '192.168.1.1' },
      { id: 2, userId: 4, username: 'john_doe', action: 'Script Execution', details: 'Executed Dark Dex in Blox Fruits', timestamp: '30 min ago', ip: '192.168.1.2' },
      { id: 3, userId: 2, username: 'beulrock', action: 'Key Redeemed', details: 'Redeemed key PREMIUM-2024-XXXX', timestamp: '1 hour ago', ip: '192.168.1.1' },
      { id: 4, userId: 3, username: 'demo_user', action: 'Injection', details: 'Injected into Pet Simulator 99', timestamp: '1 hour ago', ip: '192.168.1.3' },
      { id: 5, userId: 1, username: 'admin', action: 'Key Generated', details: 'Generated 3 new license keys', timestamp: '2 hours ago', ip: '192.168.1.100' },
    ]

    setStats({
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.status === 'active').length,
      totalKeys: mockKeys.length,
      todayActivity: mockActivities.length
    })

    setUsers(mockUsers)
    setKeys(mockKeys)
    setActivities(mockActivities)
    setIsLoading(false)
  }

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }

    const user = JSON.parse(userData)
    if (user.role?.toLowerCase() !== 'admin') {
      toast.error('Access denied. Admin only.')
      router.push('/dashboard')
      return
    }

    loadAdminData()
  }, [router])

  const generateKey = () => {
    const prefixes: Record<string, string> = {
      basic: 'BASIC',
      premium: 'PREMIUM',
      ultimate: 'ULTIMATE'
    }
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const newKey = `${prefixes[newKeyTier]}-${timestamp}-${random}`

    const newLicenseKey: LicenseKey = {
      id: keys.length + 1,
      key: newKey,
      tier: newKeyTier,
      createdBy: 'admin',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    }

    setKeys([newLicenseKey, ...keys])
    toast.success(`Generated ${newKeyTier} key: ${newKey}`)
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('Key copied to clipboard!')
  }

  const deleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId))
      toast.success('User deleted successfully')
    }
  }

  const deleteKey = (keyId: number) => {
    if (confirm('Are you sure you want to delete this key?')) {
      setKeys(keys.filter(k => k.id !== keyId))
      toast.success('Key deleted successfully')
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="page-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
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
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <Badge variant="secondary" className="bg-purple-900/30 text-purple-400 border-purple-900/30">
                <Shield className="w-3 h-3 mr-1" />
                Admin Access
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 w-full justify-start">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="keys" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Key className="w-4 h-4 mr-2" />
              Key Management
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                  <Users className="w-5 h-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                  <p className="text-xs text-green-500 mt-1">+12% this month</p>
                </CardContent>
              </Card>

              <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
                  <CheckCircle className="w-5 h-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
                  <p className="text-xs text-gray-500 mt-1">Currently online</p>
                </CardContent>
              </Card>

              <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Keys</CardTitle>
                  <Key className="w-5 h-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalKeys}</div>
                  <p className="text-xs text-gray-500 mt-1">Generated keys</p>
                </CardContent>
              </Card>

              <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Today Activity</CardTitle>
                  <Activity className="w-5 h-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.todayActivity}</div>
                  <p className="text-xs text-gray-500 mt-1">Actions logged</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Preview */}
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Latest system events</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {activities.slice(0, 10).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-gray-800/50">
                        <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{activity.action}</p>
                          <p className="text-xs text-gray-400">{activity.details}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{activity.username}</span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription className="text-gray-400">Manage all users</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">User</TableHead>
                      <TableHead className="text-gray-400">Role</TableHead>
                      <TableHead className="text-gray-400">Tier</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Last Active</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-gray-800">
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">{user.username}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role?.toLowerCase() === 'admin' ? 'default' : 'secondary'} className={user.role?.toLowerCase() === 'admin' ? 'bg-purple-900/30 text-purple-400 border-purple-900/30' : 'bg-gray-800 text-gray-400 border-gray-700'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-900/30 text-blue-400 border-blue-900/30">
                            {user.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-green-900/30 text-green-400 border-green-900/30' : 'bg-red-900/30 text-red-400 border-red-900/30'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">{user.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {user.role?.toLowerCase() !== 'admin' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteUser(user.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Key Management Tab */}
          <TabsContent value="keys" className="space-y-6">
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Key Management</CardTitle>
                    <CardDescription className="text-gray-400">Generate and manage license keys</CardDescription>
                  </div>
                  <Button
                    onClick={generateKey}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-gray-300">Key Tier</label>
                  <div className="flex gap-2 mt-2">
                    {(['basic', 'premium', 'ultimate'] as const).map((tier) => (
                      <Button
                        key={tier}
                        variant={newKeyTier === tier ? 'default' : 'outline'}
                        onClick={() => setNewKeyTier(tier)}
                        className={newKeyTier === tier ? 'bg-red-600 hover:bg-red-700' : 'border-gray-700 text-gray-400 hover:text-white'}
                      >
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">Key</TableHead>
                      <TableHead className="text-gray-400">Tier</TableHead>
                      <TableHead className="text-gray-400">Created By</TableHead>
                      <TableHead className="text-gray-400">Created At</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keys.map((key) => (
                      <TableRow key={key.id} className="border-gray-800">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm text-red-400 font-mono">{key.key}</code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyKey(key.key)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-900/30 text-blue-400 border-blue-900/30">
                            {key.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">{key.createdBy}</TableCell>
                        <TableCell className="text-gray-400">{key.createdAt}</TableCell>
                        <TableCell>
                          <Badge variant={key.status === 'active' ? 'default' : 'secondary'} className={key.status === 'active' ? 'bg-green-900/30 text-green-400 border-green-900/30' : 'bg-gray-800 text-gray-400 border-gray-700'}>
                            {key.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteKey(key.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Activity Logs</CardTitle>
                    <CardDescription className="text-gray-400">All system events and actions</CardDescription>
                  </div>
                  <Button variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-950">
                    <Download className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50">
                        <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-white">{activity.action}</p>
                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-400">{activity.details}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {activity.username}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              IP: {activity.ip}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
