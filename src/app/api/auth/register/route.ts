import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, referrerId } = body

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      )
    }

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Validate referrer if provided
    if (referrerId) {
      const referrer = await db.user.findUnique({
        where: { id: referrerId },
      })

      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referrer' },
          { status: 400 }
        )
      }
    }

    // Create user
    const newUser = await createUser({
      username,
      email,
      password,
      role: 'user',
      tier: 'Basic',
      referrerId,
    })

    // Create whitelist entry
    await db.whitelist.create({
      data: {
        userId: newUser.id,
        tier: 'Basic',
        active: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: newUser,
    })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
