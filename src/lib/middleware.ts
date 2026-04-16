import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return verifyToken(token)
}

export function requireAuth(handler: (req: NextRequest, user: any) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request)
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return handler(request, user)
  }
}

export function requireAdmin(handler: (req: NextRequest, user: any) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request)
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (user.role?.toLowerCase() !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return handler(request, user)
  }
}
