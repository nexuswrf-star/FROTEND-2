import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const PORT = 3001

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Store connected clients with their user info
const connectedClients = new Map<string, any>()

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`)

  // Handle user authentication
  socket.on('authenticate', async (data: { token: string }) => {
    try {
      const { token } = data

      // Verify token with main app
      const response = await fetch('http://localhost:3000/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        connectedClients.set(socket.id, { user: result.user, socket, token })
        socket.emit('authenticated', { success: true, user: result.user })
        console.log(`[Socket] User authenticated: ${result.user?.username}`)

        // Broadcast user count update
        io.emit('userCount', { count: connectedClients.size })
      } else {
        socket.emit('authenticated', { success: false, error: 'Invalid token' })
      }
    } catch (error) {
      console.error('[Socket] Auth error:', error)
      socket.emit('authenticated', { success: false, error: 'Authentication failed' })
    }
  })

  // Handle activity updates (e.g., user joins game, executes script)
  socket.on('activity', async (data: { action: string, details?: string, gameName?: string, gameId?: string }) => {
    const client = connectedClients.get(socket.id)
    if (!client?.user) return

    try {
      // Broadcast activity to admin panel
      io.emit('newActivity', {
        id: Date.now().toString(),
        userId: client.user.id,
        username: client.user.username,
        action: data.action,
        details: data.details || '',
        timestamp: new Date().toISOString(),
        ip: socket.handshake.address,
      })

      // Log to main app for database storage
      await fetch('http://localhost:3000/api/activity/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${client.token}`,
        },
        body: JSON.stringify({
          action: data.action,
          details: data.details,
          gameName: data.gameName,
          gameId: data.gameId,
        }),
      })

      console.log(`[Socket] Activity logged: ${data.action} by ${client.user.username}`)
    } catch (error) {
      console.error('[Socket] Activity log error:', error)
    }
  })

  // Handle key redemption
  socket.on('keyRedeemed', async (data: { tier: string, key: string }) => {
    const client = connectedClients.get(socket.id)
    if (!client?.user) return

    try {
      // Broadcast to admin panel
      io.emit('keyRedeemed', {
        userId: client.user.id,
        username: client.user.username,
        tier: data.tier,
        key: data.key,
        timestamp: new Date().toISOString(),
      })

      console.log(`[Socket] Key redeemed: ${data.tier} by ${client.user.username}`)
    } catch (error) {
      console.error('[Socket] Key redeem error:', error)
    }
  })

  // Handle user update (e.g., profile change, settings update)
  socket.on('userUpdate', (data: any) => {
    const client = connectedClients.get(socket.id)
    if (!client?.user) return

    try {
      // Broadcast to admin panel
      io.emit('userUpdate', {
        userId: client.user.id,
        username: client.user.username,
        ...data,
        timestamp: new Date().toISOString(),
      })

      console.log(`[Socket] User updated: ${client.user.username}`)
    } catch (error) {
      console.error('[Socket] User update error:', error)
    }
  })

  // Handle new user registration
  socket.on('newUser', (data: { username: string, email: string }) => {
    try {
      // Broadcast to admin panel
      io.emit('newUser', {
        ...data,
        timestamp: new Date().toISOString(),
      })

      console.log(`[Socket] New user: ${data.username}`)
    } catch (error) {
      console.error('[Socket] New user error:', error)
    }
  })

  // Handle game execution (real-time game status)
  socket.on('gameExecution', (data: { gameName: string, status: string, details?: string }) => {
    const client = connectedClients.get(socket.id)
    if (!client?.user) return

    try {
      // Broadcast to all interested clients
      io.emit('gameStatus', {
        userId: client.user.id,
        username: client.user.username,
        robloxUsername: client.user.robloxUsername,
        gameName: data.gameName,
        status: data.status,
        details: data.details,
        timestamp: new Date().toISOString(),
      })

      console.log(`[Socket] Game execution: ${data.gameName} - ${data.status} by ${client.user.username}`)
    } catch (error) {
      console.error('[Socket] Game execution error:', error)
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const client = connectedClients.get(socket.id)
    if (client) {
      console.log(`[Socket] User disconnected: ${client.user?.username}`)
      connectedClients.delete(socket.id)

      // Broadcast user count update
      io.emit('userCount', { count: connectedClients.size })
    } else {
      console.log(`[Socket] Client disconnected: ${socket.id}`)
      connectedClients.delete(socket.id)
      io.emit('userCount', { count: connectedClients.size })
    }
  })
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`[Socket] Real-time service running on port ${PORT}`)
})

// Cleanup on shutdown
process.on('SIGINT', () => {
  httpServer.close()
  console.log('[Socket] Server shut down gracefully')
})
