'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Users, 
  Key, 
  Shield, 
  Zap, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus,
  Trash2,
  Settings,
  Copy,
  RefreshCw,
  Globe,
  Server,
  Lock,
  Unlock
} from 'lucide-react';

interface ConnectionState {
  status: 'connected' | 'disconnected' | 'connecting';
  connectedUsers: number;
  lastPing: number;
  serverTime: string;
}

interface ActivityLog {
  id: string;
  type: 'login' | 'key_redeem' | 'whitelist_add' | 'whitelist_remove' | 'error';
  username: string;
  action: string;
  timestamp: string;
  details?: string;
}

interface Key {
  id: string;
  key: string;
  tier: 'Basic' | 'Premium' | 'Ultimate';
  status: 'active' | 'redeemed' | 'expired';
  usedBy?: string;
  expiryDate?: string;
}

interface WhitelistEntry {
  id: string;
  username: string;
  robloxUsername: string;
  tier: string;
  expiryDate: string;
  status: 'active' | 'expired';
}

export default function RealtimeDashboard() {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'disconnected',
    connectedUsers: 0,
    lastPing: 0,
    serverTime: new Date().toISOString()
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [keys, setKeys] = useState<Key[]>([]);
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  // Simulate realtime connection
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setConnectionState(prev => ({
        ...prev,
        serverTime: new Date().toISOString(),
        lastPing: Math.floor(Math.random() * 50) + 10
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Simulate incoming activity logs
  useEffect(() => {
    if (!autoRefresh || connectionState.status !== 'connected') return;

    const actions = [
      { type: 'login' as const, action: 'User logged in', details: 'IP: 192.168.1.1' },
      { type: 'key_redeem' as const, action: 'Key redeemed', details: 'Premium Tier' },
      { type: 'whitelist_add' as const, action: 'Added to whitelist', details: 'Game ID: 12345' },
      { type: 'whitelist_remove' as const, action: 'Removed from whitelist', details: 'Expired' },
    ];

    const usernames = ['player1', 'pro_gamer', 'script_kiddie', 'admin_test', 'new_user'];

    const interval = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];

      const newLog: ActivityLog = {
        id: Date.now().toString(),
        ...randomAction,
        username: randomUsername,
        timestamp: new Date().toISOString()
      };

      setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh, connectionState.status]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionState(prev => ({ ...prev, status: 'connecting' }));

    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    setConnectionState(prev => ({
      ...prev,
      status: 'connected',
      connectedUsers: Math.floor(Math.random() * 50) + 10,
      lastPing: Math.floor(Math.random() * 50) + 10
    }));
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    setConnectionState(prev => ({
      ...prev,
      status: 'disconnected',
      connectedUsers: 0
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getConnectionBadge = () => {
    switch (connectionState.status) {
      case 'connected':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-500"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Connecting...</Badge>;
      case 'disconnected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Disconnected</Badge>;
    }
  };

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'login':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'key_redeem':
        return <Key className="w-4 h-4 text-green-500" />;
      case 'whitelist_add':
        return <Shield className="w-4 h-4 text-purple-500" />;
      case 'whitelist_remove':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'basic':
        return 'bg-gray-500';
      case 'premium':
        return 'bg-blue-500';
      case 'ultimate':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Beulrock SS</h1>
                <p className="text-sm text-slate-400">Realtime Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {getConnectionBadge()}
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400">Server Time</p>
                <p className="text-sm font-mono text-white">
                  {new Date(connectionState.serverTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Connection Controls */}
        <Card className="mb-6 border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="w-5 h-5" />
              Connection Manager
            </CardTitle>
            <CardDescription className="text-slate-400">
              Manage your realtime connection to Roblox games
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              {connectionState.status === 'connected' ? (
                <Button onClick={handleDisconnect} variant="destructive" size="lg">
                  <XCircle className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              ) : (
                <Button 
                  onClick={handleConnect} 
                  disabled={isConnecting}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Connect to Server
                    </>
                  )}
                </Button>
              )}
              
              <div className="flex items-center gap-2 ml-auto">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Auto Refresh
                </label>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.location.reload()}
                  className="border-slate-600 hover:bg-slate-700"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Connection Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-400">Connected Users</span>
                </div>
                <p className="text-2xl font-bold text-white">{connectionState.connectedUsers}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-400">Last Ping</span>
                </div>
                <p className="text-2xl font-bold text-white">{connectionState.lastPing}ms</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-400">Total Keys</span>
                </div>
                <p className="text-2xl font-bold text-white">{keys.length}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-slate-400">Whitelist</span>
                </div>
                <p className="text-2xl font-bold text-white">{whitelist.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-700">
              <Activity className="w-4 h-4 mr-2" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="keys" className="data-[state=active]:bg-slate-700">
              <Key className="w-4 h-4 mr-2" />
              Key Management
            </TabsTrigger>
            <TabsTrigger value="whitelist" className="data-[state=active]:bg-slate-700">
              <Shield className="w-4 h-4 mr-2" />
              Whitelist
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Activity Log Tab */}
          <TabsContent value="activity">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Live Activity</CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time events and system activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {activityLogs.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No activity yet. Connect to start receiving events.</p>
                      </div>
                    ) : (
                      activityLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                        >
                          <div className="mt-1">
                            {getActivityIcon(log.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white">{log.username}</span>
                              <span className="text-sm text-slate-400">•</span>
                              <span className="text-sm text-slate-400">{log.action}</span>
                            </div>
                            {log.details && (
                              <p className="text-sm text-slate-400">{log.details}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keys Tab */}
          <TabsContent value="keys">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Key Management</CardTitle>
                    <CardDescription className="text-slate-400">
                      Generate and manage access keys
                    </CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {keys.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No keys generated yet.</p>
                      </div>
                    ) : (
                      keys.map((key) => (
                        <div
                          key={key.id}
                          className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <Key className="w-5 h-5 text-yellow-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                <code className="font-mono text-white bg-slate-800 px-2 py-1 rounded">
                                  {key.key}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:bg-slate-700"
                                  onClick={() => copyToClipboard(key.key)}
                                >
                                  <Copy className="w-3 h-3 text-slate-400" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getTierColor(key.tier)}>
                                  {key.tier}
                                </Badge>
                                <Badge
                                  variant={key.status === 'active' ? 'default' : 'secondary'}
                                  className={
                                    key.status === 'active'
                                      ? 'bg-green-500'
                                      : key.status === 'redeemed'
                                      ? 'bg-blue-500'
                                      : 'bg-red-500'
                                  }
                                >
                                  {key.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {key.usedBy && (
                              <div className="text-right mr-4">
                                <p className="text-xs text-slate-400">Used by</p>
                                <p className="text-sm text-white">{key.usedBy}</p>
                              </div>
                            )}
                            <Button variant="ghost" size="icon" className="hover:bg-red-500/20 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whitelist Tab */}
          <TabsContent value="whitelist">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Whitelist Management</CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage users and their Roblox whitelist status
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search username..."
                      className="w-64 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea area className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {whitelist.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No whitelist entries yet.</p>
                      </div>
                    ) : (
                      whitelist.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                              <Globe className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{entry.username}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-slate-400">{entry.robloxUsername}</span>
                                <Badge className={getTierColor(entry.tier)}>{entry.tier}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-slate-400">Expires</p>
                              <p className="text-sm text-white">
                                {new Date(entry.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={entry.status === 'active' ? 'default' : 'secondary'}
                              className={entry.status === 'active' ? 'bg-green-500' : 'bg-red-500'}
                            >
                              {entry.status === 'active' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Expired
                                </>
                              )}
                            </Badge>
                            <Button variant="ghost" size="icon" className="hover:bg-red-500/20 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure security options and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-400">Enable 2FA for admin accounts</p>
                    </div>
                    <Button variant="outline" className="border-slate-600">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">IP Whitelist</p>
                      <p className="text-sm text-slate-400">Restrict access by IP address</p>
                    </div>
                    <Button variant="outline" className="border-slate-600">
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Session Timeout</p>
                      <p className="text-sm text-slate-400">Auto-logout after inactivity</p>
                    </div>
                    <select className="bg-slate-900 border border-slate-700 text-white rounded px-3 py-2">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>Never</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Server Configuration
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure server and connection settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Roblox Place ID</label>
                    <Input
                      placeholder="Enter Place ID"
                      className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">API Endpoint</label>
                    <Input
                      placeholder="https://api.example.com"
                      className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Webhook URL</label>
                    <Input
                      placeholder="https://discord.com/api/webhooks/..."
                      className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                    Save Configuration
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activity Monitoring
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure activity logging and monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Log All Activities</p>
                      <p className="text-sm text-slate-400">Record every user action</p>
                    </div>
                    <input type="checkbox" checked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Discord Notifications</p>
                      <p className="text-sm text-slate-400">Send alerts to Discord</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Email Alerts</p>
                      <p className="text-sm text-slate-400">Receive email notifications</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Whitelist Settings
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure automatic whitelist management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Default Tier</label>
                    <select className="w-full bg-slate-900 border border-slate-700 text-white rounded px-3 py-2">
                      <option>Basic</option>
                      <option>Premium</option>
                      <option>Ultimate</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Default Duration</label>
                    <select className="w-full bg-slate-900 border border-slate-700 text-white rounded px-3 py-2">
                      <option>24 hours</option>
                      <option>7 days</option>
                      <option>30 days</option>
                      <option>Lifetime</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Auto-expire Behaviour</label>
                    <select className="w-full bg-slate-900 border-slate-700 text-white rounded px-3 py-2">
                      <option>Revoke access</option>
                      <option>Downgrade to Basic</option>
                      <option>Send warning only</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-auto py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            © 2025 Beulrock SS. Realtime Dashboard v1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
}
