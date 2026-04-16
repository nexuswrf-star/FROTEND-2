import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const { action, details, gameName, gameId } = body

    // Log activity to database
    await db.activityLog.create({
      data: {
        userId: user.userId,
        action: action,
        status: 'success',
        details: details,
        gameName,
        gameId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Activity logged successfully',
    })

  } catch (error) {
    console.error('Activity log error:', error)
    return NextResponse.json(
      { error: 'Error logging activity' },
      { status: 500 }
    )
  }
})
