import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

// GET /api/admin/keys - List all keys (admin only)
export const GET = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url)
    const tier = searchParams.get('tier')
    const redeemed = searchParams.get('redeemed')

    const where: any = {}

    if (tier) {
      where.tier = tier
    }

    if (redeemed === 'true') {
      where.redeemed = true
    } else if (redeemed === 'false') {
      where.redeemed = false
    }

    const keys = await db.key.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: keys,
    })

  } catch (error) {
    console.error('Keys fetch error:', error)
    return NextResponse.json(
      { error: 'Error fetching keys' },
      { status: 500 }
    )
  }
})

// POST /api/admin/keys - Generate new key (admin only)
export const POST = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const { tier, count = 1, expiryDays = 365 } = body

    // Validate tier
    const validTiers = ['Basic', 'Premium', 'Ultimate']
    if (!tier || !validTiers.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be Basic, Premium, or Ultimate' },
        { status: 400 }
      )
    }

    // Validate count
    if (count < 1 || count > 100) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 100' },
        { status: 400 }
      )
    }

    // Generate keys
    const generatedKeys = []
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)

    for (let i = 0; i < count; i++) {
      // Generate random key code
      const code = `${tier.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      const key = await db.key.create({
        data: {
          code,
          tier,
          expiresAt,
        },
      })

      generatedKeys.push(key)
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${count} keys`,
      data: generatedKeys,
    })

  } catch (error) {
    console.error('Key generation error:', error)
    return NextResponse.json(
      { error: 'Error generating keys' },
      { status: 500 }
    )
  }
})
