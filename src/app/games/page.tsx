'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Gamepad2, 
  Users, 
  Search, 
  Shield, 
  Zap,
  RefreshCw,
  Ghost
} from 'lucide-react'
import { toast } from 'sonner'

interface Game {
  id: number
  name: string
  placeId: number
  players: number
  max_players: number
  status: 'online' | 'offline'
  backdoor: boolean
  image: string
  lastUpdated: number
}

export default function GamesPage() {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [filter, setFilter] = useState<'all' | 'backdoor' | 'active'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize games with placeIds
  const initialGames: Game[] = [
    {
      id: 1,
      name: 'Blox Fruits',
      placeId: 2753915549,
      players: 15420,
      max_players: 50000,
      status: 'online',
      backdoor: true,
      image: '',
      lastUpdated: 0
    },
    {
      id: 2,
      name: 'Pet Simulator 99',
      placeId: 8737899160,
      players: 8900,
      max_players: 20000,
      status: 'online',
      backdoor: true,
      image: '',
      lastUpdated: 0
    },
    {
      id: 3,
      name: 'Brookhaven RP',
      placeId: 4924922222,
      players: 45000,
      max_players: 100000,
      status: 'online',
      backdoor: false,
      image: '',
      lastUpdated: 0
    },
    {
      id: 4,
      name: 'Tower of Hell',
      placeId: 1962086868,
      players: 1200,
      max_players: 5000,
      status: 'online',
      backdoor: false,
      image: '',
      lastUpdated: 0
    },
    {
      id: 5,
      name: 'Da Hood',
      placeId: 2788229376,
      players: 12000,
      max_players: 25000,
      status: 'online',
      backdoor: true,
      image: '',
      lastUpdated: 0
    },
    {
      id: 6,
      name: 'Murder Mystery 2',
      placeId: 142823291,
      players: 5600,
      max_players: 10000,
      status: 'online',
      backdoor: true,
      image: '',
      lastUpdated: 0
    },
    {
      id: 7,
      name: 'Adopt Me!',
      placeId: 920587237,
      players: 15000,
      max_players: 40000,
      status: 'offline',
      backdoor: false,
      image: '',
      lastUpdated: 0
    },
    {
      id: 8,
      name: 'Arsenal',
      placeId: 286090429,
      players: 3200,
      max_players: 5000,
      status: 'online',
      backdoor: false,
      image: '',
      lastUpdated: 0
    },
    {
      id: 9,
      name: 'Blox Fruits (PVP)',
      placeId: 7449423635,
      players: 4500,
      max_players: 10000,
      status: 'online',
      backdoor: true,
      image: '',
      lastUpdated: 0
    },
  ]

  useEffect(() => {
    loadGamesWithImages()
    startRealTimeUpdates()

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [])

  const loadGamesWithImages = async () => {
    setIsLoading(true)
    
    // Load games with images from Roblox Thumbnails API
    const gamesWithImages = await Promise.all(
      initialGames.map(async (game) => {
        try {
          const imageUrl = await fetchGameIcon(game.placeId)
          return { ...game, image: imageUrl, lastUpdated: Date.now() }
        } catch (error) {
          console.error(`Failed to fetch icon for ${game.name}:`, error)
          return { ...game, lastUpdated: Date.now() }
        }
      })
    )

    setGames(gamesWithImages)
    setIsLoading(false)
  }

  const fetchGameIcon = async (placeId: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${placeId}&size=512x512&format=Png`
      )
      const data = await response.json()
      
      if (data.data && data.data[0] && data.data[0].imageUrl) {
        return data.data[0].imageUrl
      }
      throw new Error('No image found')
    } catch (error) {
      console.error('Error fetching game icon:', error)
      // Return fallback gradient
      const gradients = [
        'linear-gradient(135deg, #3b82f6, #2563eb)',
        'linear-gradient(135deg, #f59e0b, #d97706)',
        'linear-gradient(135deg, #10b981, #059669)',
        'linear-gradient(135deg, #ef4444, #b91c1c)',
        'linear-gradient(135deg, #8b5cf6, #7c3aed)',
        'linear-gradient(135deg, #6366f1, #4f46e5)',
        'linear-gradient(135deg, #ec4899, #db2777)',
        'linear-gradient(135deg, #64748b, #475569)',
      ]
      const randomIndex = placeId % gradients.length
      return gradients[randomIndex]
    }
  }

  const startRealTimeUpdates = () => {
    // Update player counts every 30 seconds
    refreshIntervalRef.current = setInterval(() => {
      updatePlayerCounts()
    }, 30000)
  }

  const updatePlayerCounts = () => {
    setGames(prevGames =>
      prevGames.map(game => ({
        ...game,
        // Simulate real-time player count changes
        players: Math.max(0, game.players + Math.floor(Math.random() * 200 - 100)),
        lastUpdated: Date.now()
      }))
    )
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadGamesWithImages()
    setIsRefreshing(false)
    toast.success('Games refreshed successfully!')
  }

  const filteredGames = games.filter(game => {
    // Filter by tab
    if (filter === 'backdoor' && !game.backdoor) return false
    if (filter === 'active' && game.status === 'offline') return false

    // Filter by search query
    if (searchQuery) {
      return game.name.toLowerCase().includes(searchQuery.toLowerCase())
    }

    return true
  })

  const handleGameAction = (game: Game) => {
    if (game.backdoor) {
      toast.success(`Injecting into ${game.name}...`)
      setTimeout(() => {
        router.push('/executor')
      }, 1000)
    } else {
      toast.info(`Connecting to ${game.name}...`)
      setTimeout(() => {
        toast.success('Connected successfully!')
      }, 1500)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
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
              <h1 className="text-xl font-bold text-white">Games Library</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-900/30">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                Real-time
              </Badge>
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
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
              />
            </div>
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList className="bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
                All Games ({games.length})
              </TabsTrigger>
              <TabsTrigger value="backdoor" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
                <Ghost className="w-4 h-4 mr-2" />
                Backdoor ({games.filter(g => g.backdoor).length})
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-red-900/50 data-[state=active]:text-white">
                Active ({games.filter(g => g.status === 'online').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Games Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl animate-pulse">
                <div className="aspect-video bg-gray-800 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-800 rounded"></div>
                  <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-800 rounded"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <Card className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl p-12 text-center">
            <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No games found</h3>
            <p className="text-gray-400">Try adjusting your search or filter settings</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <Card
                key={game.id}
                className="border-red-900/30 bg-gray-900/50 backdrop-blur-xl overflow-hidden hover:border-red-900/70 transition-all cursor-pointer group"
              >
                {/* Game Banner */}
                <div
                  className="relative aspect-video"
                  style={{
                    backgroundImage: game.image.startsWith('http')
                      ? `url(${game.image})`
                      : game.image,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className={`${
                        game.status === 'online'
                          ? 'bg-green-900/80 text-green-400 border-green-900/50'
                          : 'bg-red-900/80 text-red-400 border-red-900/50'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 ${game.status === 'online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                      {game.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Backdoor Badge */}
                  {game.backdoor && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-purple-900/80 text-purple-400 border-purple-900/50">
                        <Ghost className="w-3 h-3 mr-1" />
                        BACKDOOR
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-red-400 transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-sm text-gray-400">Place ID: {game.placeId}</p>
                  </div>

                  {/* Player Count */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      {formatNumber(game.players)} Playing
                    </span>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleGameAction(game)}
                    className={`w-full ${
                      game.backdoor
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                    }`}
                  >
                    {game.backdoor ? (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Inject Now
                      </>
                    ) : (
                      <>
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Join Server
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
