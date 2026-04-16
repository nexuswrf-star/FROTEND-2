import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

// GET /api/activity - Get activity logs
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Regular users can only see their own logs
    // Admins can see all logs
    const where = user.role === 'admin' ? {} : { userId: user.userId }

    const logs = await db.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        game: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    const total = await db.activityLog.count({ where })

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })

  } catch (error) {
    console.error('Activity logs fetch error:', error)
    return NextResponse.json(
      { error: 'Error fetching activity logs' },
      { status: 500 }
    )
  }
})
