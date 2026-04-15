import { NextRequest, NextResponse } from 'next/server'

// Mock user database (in production, this would be in a real database)
const MOCK_USERS = [
  { id: 1, username: 'admin', email: 'admin@beulrock.com', password: 'admin', role: 'admin', tier: 'ultimate' },
  { id: 2, username: 'beulrock', email: 'user@beulrock.com', password: 'password', role: 'user', tier: 'premium' },
  { id: 3, username: 'demo', email: 'demo@test.com', password: 'demo', role: 'user', tier: 'basic' },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user (match by email or username)
    const user = MOCK_USERS.find(
      u => u.email === email || u.username === email
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check password (in production, use bcrypt or similar)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate mock token (in production, use JWT)
    const token = `mock_token_${user.username}_${Date.now()}`

    // Return success response (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
