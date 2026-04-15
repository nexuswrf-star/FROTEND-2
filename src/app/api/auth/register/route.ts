import { NextRequest, NextResponse } from 'next/server'

// Mock user database (in production, this would be in a real database)
let MOCK_USERS = [
  { id: 1, username: 'admin', email: 'admin@beulrock.com', password: 'admin', role: 'admin', tier: 'ultimate' },
  { id: 2, username: 'beulrock', email: 'user@beulrock.com', password: 'password', role: 'user', tier: 'premium' },
  { id: 3, username: 'demo', email: 'demo@test.com', password: 'demo', role: 'user', tier: 'basic' },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, referral } = body

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    // Check password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if username already exists
    if (MOCK_USERS.find(u => u.username === username)) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      )
    }

    // Check if email already exists
    if (MOCK_USERS.find(u => u.email === email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = {
      id: MOCK_USERS.length + 1,
      username,
      email,
      password, // In production, hash this with bcrypt!
      role: 'user',
      tier: referral && referral.includes('ULTIMATE') ? 'ultimate' : 
            referral && referral.includes('PREMIUM') ? 'premium' : 'basic'
    }

    MOCK_USERS.push(newUser)

    // Generate mock token (in production, use JWT)
    const token = `mock_token_${newUser.username}_${Date.now()}`

    // Return success response (excluding password)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Registration successful'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
