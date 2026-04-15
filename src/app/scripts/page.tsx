'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Code, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  Play,
  Shield,
  CheckCircle,
  Zap,
  FileCode
} from 'lucide-react'
import { toast } from 'sonner'

interface Script {
  id: number
  title: string
  description: string
  content: string
  verified: boolean
  author: string
  category: string
  createdAt: string
}

export default function ScriptsPage() {
  const router = useRouter()
  const [scripts, setScripts] = useState<Script[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingScript, setEditingScript] = useState<Script | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'General'
  })

  useEffect(() => {
    loadScripts()
  }, [])

  const loadScripts = () => {
    // Mock scripts data
    const mockScripts: Script[] = [
      {
        id: 1,
        title: 'Dark Dex',
        description: 'Advanced decompiler and script explorer for Roblox',
        content: `-- Dark Dex v3\n-- Advanced decompiler\nloadstring(game:HttpGet("https://raw.githubusercontent.com/Babyhamsta/RBLX_Scripts/main/Universal/BypassedDarkDexV3.lua"))()`,
        verified: true,
        author: 'Beulrock Team',
        category: 'Tools',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        title: 'Remote Spy',
        description: 'Monitor and spoof remote fire events in real-time',
        content: `-- Remote Spy\n-- Monitor all remotes\nloadstring(game:HttpGet("https://raw.githubusercontent.com/infyiff/backup/main/SimpleSpyV3/main.lua"))()`,
        verified: true,
        author: 'Beulrock Team',
        category: 'Tools',
        createdAt: '2024-01-10'
      },
      {
        id: 3,
        title: 'Auto Farm Blox Fruits',
        description: 'Automatic farming script for Blox Fruits',
        content: `-- Auto Farm\nloadstring(game:HttpGet("https://raw.githubusercontent.com/REDzHUB/BloxFruits/main/redz9999"))()`,
        verified: false,
        author: 'Community',
        category: 'Farm',
        createdAt: '2024-02-01'
      },
      {
        id: 4,
        title: 'Infinite Jump',
        description: 'Infinite jump for any game',
        content: `-- Infinite Jump\nlocal InfiniteJumpEnabled = true\ngame:GetService("UserInputService").JumpRequest:connect(function()\n\tif InfiniteJumpEnabled then\n\t\tgame:GetService"Players".LocalPlayer.Character:FindFirstChildOfClass'Humanoid':ChangeState("Jumping")\n\tend\nend)`,
        verified: true,
        author: 'Beulrock Team',
        category: 'Utilities',
        createdAt: '2024-01-20'
      },
      {
        id: 5,
        title: 'ESP & Wallhack',
        description: 'See players through walls with ESP',
        content: `-- ESP Script\nloadstring(game:HttpGet("https://raw.githubusercontent.com/Lucasfreal/source/master/esp.lua"))()`,
        verified: false,
        author: 'Community',
        category: 'Combat',
        createdAt: '2024-02-05'
      },
    ]

    setScripts(mockScripts)
    setIsLoading(false)
  }

  const handleOpenDialog = (script?: Script) => {
    if (script) {
      setEditingScript(script)
      setFormData({
        title: script.title,
        description: script.description,
        content: script.content,
        category: script.category
      })
    } else {
      setEditingScript(null)
      setFormData({
        title: '',
        description: '',
        content: '',
        category: 'General'
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingScript(null)
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'General'
    })
  }

  const handleSaveScript = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in title and content')
      return
    }

    if (editingScript) {
      // Update existing script
      setScripts(prev =>
        prev.map(s =>
          s.id === editingScript.id
            ? {
                ...s,
                title: formData.title,
                description: formData.description,
                content: formData.content,
                category: formData.category
              }
            : s
        )
      )
      toast.success('Script updated successfully!')
    } else {
      // Create new script
      const newScript: Script = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        content: formData.content,
        verified: false,
        author: 'You',
        category: formData.category,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setScripts(prev => [newScript, ...prev])
      toast.success('Script created successfully!')
    }

    handleCloseDialog()
  }

  const handleDeleteScript = (scriptId: number) => {
    setScripts(prev => prev.filter(s => s.id !== scriptId))
    toast.success('Script deleted successfully!')
  }

  const handleCopyScript = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Script copied to clipboard!')
  }

  const handleExecuteScript = (content: string) => {
    navigator.clipboard.writeText(content)
    router.push('/executor')
    toast.info('Script copied! Paste in executor to run.')
  }

  const verifiedScripts = scripts.filter(s => s.verified)
  const personalScripts = scripts.filter(s => !s.verified && s.author === 'You')
  const communityScripts = scripts.filter(s => !s.verified && s.author !== 'You')

  const allScripts = [...verifiedScripts, ...personalScripts, ...communityScripts]

  const filteredScripts = allScripts.filter(script =>
    script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    script.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    script.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading scripts...</p>
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
              <h1 className="text-xl font-bold text-white">Script Library</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-red-900/30 text-red-400 border-red-900/30">
                <FileCode className="w-4 h-4 mr-1" />
                {allScripts.length} Scripts
              </Badge>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Script
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-white">
                  <DialogHeader>
                    <DialogTitle>{editingScript ? 'Edit Script' : 'Create New Script'}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingScript ? 'Update your script details' : 'Add a new script to your library'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Script title"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Farm, Tools, Combat"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label>Script Code</Label>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="-- Enter your Lua script here"
                        className="bg-gray-800 border-gray-700 text-white min-h-[200px] font-mono text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleSaveScript}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    >
                      {editingScript ? 'Update Script' : 'Create Script'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-white">{allScripts.length}</p>
              <p className="text-sm text-gray-400">Total Scripts</p>
            </CardContent>
          </Card>
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-white">{verifiedScripts.length}</p>
              <p className="text-sm text-gray-400">Verified</p>
            </CardContent>
          </Card>
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-white">{personalScripts.length}</p>
              <p className="text-sm text-gray-400">Personal</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search scripts by title, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
          />
        </div>

        {/* Scripts Grid */}
        {filteredScripts.length === 0 ? (
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl p-12 text-center">
            <FileCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No scripts found</h3>
            <p className="text-gray-400">Try adjusting your search or create a new script</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScripts.map((script) => (
              <Card
                key={script.id}
                className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl overflow-hidden hover:border-red-900/70 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-white text-lg">{script.title}</CardTitle>
                        {script.verified && (
                          <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-900/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-gray-400">{script.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-gray-700 text-gray-400">
                      {script.category}
                    </Badge>
                    <span className="text-xs text-gray-500">by {script.author}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-gray-800/50 max-h-[100px] overflow-hidden">
                    <pre className="text-xs text-gray-400 font-mono">
                      {script.content.substring(0, 150)}...
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyScript(script.content)}
                      className="flex-1 border-red-900/50 text-red-400 hover:bg-red-950"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExecuteScript(script.content)}
                      className="flex-1 border-red-900/50 text-red-400 hover:bg-red-950"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Execute
                    </Button>
                    {script.author === 'You' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(script)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteScript(script.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
