'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket(token?: string) {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!token) return

    // Create socket connection
    const socket = io('/', {
      path: '/',
      query: { XTransformPort: '3001' },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    })

    socketRef.current = socket

    // Connect and authenticate
    socket.on('connect', () => {
      console.log('[Socket] Connected to server')
      socket.emit('authenticate', { token })
    })

    socket.on('authenticated', (data) => {
      console.log('[Socket] Authenticated:', data)
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from server')
      setIsConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [token])

  return { socket: socketRef.current, isConnected }
}

export function useSocketEvents<T = any>(event: string, callback: (data: T) => void, token?: string) {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    if (!token) return

    const socket = io('/', {
      path: '/',
      query: { XTransformPort: '3001' },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      socket.emit('authenticate', { token })
    })

    const handler = (eventData: T) => {
      setData(eventData)
      if (callback) {
        callback(eventData)
      }
    }

    socket.on(event, handler)

    return () => {
      socket.off(event, handler)
      socket.disconnect()
    }
  }, [event, token, callback])

  return data
}
