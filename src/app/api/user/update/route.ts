import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const { robloxUsername, autoWhitelist, enableNotifications, profilePicture } = body

    // Update user
    const updatedUser = await db.user.update({
      where: { id: user.userId },
      data: {
        ...(robloxUsername && { robloxUsername }),
        ...(profilePicture && { profilePicture }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        tier: true,
        robloxUsername: true,
        profilePicture: true,
      },
    })

    // Update whitelist with Roblox username
    if (robloxUsername) {
      await db.whitelist.upsert({
        where: { userId: user.userId },
        create: {
          userId: user.userId,
          tier: user.tier,
          active: true,
          robloxUsername,
        },
        update: {
          robloxUsername,
        },
      })
    }

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.userId,
        action: 'settings_updated',
        status: 'success',
        details: robloxUsername ? `Roblox username set to ${robloxUsername}` : 'Settings updated',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      user: updatedUser,
    })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Error updating user settings' },
      { status: 500 }
    )
  }
})
