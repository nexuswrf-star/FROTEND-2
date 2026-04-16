import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

// POST /api/redeem - Redeem a license key
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const { code } = body

    // Validate input
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'License key is required' },
        { status: 400 }
      )
    }

    // Find key
    const key = await db.key.findUnique({
      where: { code },
    })

    if (!key) {
      return NextResponse.json(
        { error: 'Invalid license key' },
        { status: 404 }
      )
    }

    // Check if already redeemed
    if (key.redeemed) {
      return NextResponse.json(
        { error: 'This key has already been redeemed' },
        { status: 400 }
      )
    }

    // Check if expired
    if (key.expiresAt && new Date() > key.expiresAt) {
      return NextResponse.json(
        { error: 'This key has expired' },
        { status: 400 }
      )
    }

    // Update user tier
    await db.user.update({
      where: { id: user.userId },
      data: { tier: key.tier },
    })

    // Update whitelist
    await db.whitelist.upsert({
      where: { userId: user.userId },
      create: {
        userId: user.userId,
        tier: key.tier,
        active: true,
        expiresAt: key.expiresAt,
      },
      update: {
        tier: key.tier,
        active: true,
        expiresAt: key.expiresAt,
      },
    })

    // Mark key as redeemed
    await db.key.update({
      where: { id: key.id },
      data: {
        redeemed: true,
        redeemedAt: new Date(),
        userId: user.userId,
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.userId,
        action: 'key_redeemed',
        status: 'success',
        details: `Key: ${code}, Tier: ${key.tier}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Successfully redeemed ${key.tier} tier`,
      data: {
        tier: key.tier,
        expiresAt: key.expiresAt,
      },
    })

  } catch (error) {
    console.error('Key redeem error:', error)
    return NextResponse.json(
      { error: 'Error redeeming key' },
      { status: 500 }
    )
  }
})
