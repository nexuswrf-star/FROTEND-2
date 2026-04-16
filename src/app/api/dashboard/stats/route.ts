import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

// GET /api/dashboard/stats - Get dashboard stats
export const GET = requireAuth(async (request: NextRequest, user: any) => {
  try {
    // Get user data
    const userData = await db.user.findUnique({
      where: { id: user.userId },
      include: {
        whitelist: true,
        _count: {
          select: {
            scripts: true,
            activityLogs: true,
          },
        },
      },
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Count executions (script_executed activities)
    const executions = await db.activityLog.count({
      where: {
        userId: user.userId,
        action: 'script_executed',
      },
    })

    // Calculate days active
    const daysActive = Math.floor(
      (new Date().getTime() - userData.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1

    // Count referrals
    const referrals = await db.user.count({
      where: { referrerId: user.userId },
    })

    // Get recent activity
    const recentActivity = await db.activityLog.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        game: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Format activity
    const formattedActivity = recentActivity.map(log => ({
      id: log.id,
      action: log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      game: log.game?.name || 'N/A',
      time: formatTimeAgo(log.createdAt),
      status: log.status,
    }))

    // Calculate referral earnings
    const referralEarnings = referrals * 5.0 // $5 per referral

    return NextResponse.json({
      success: true,
      data: {
        user: {
          username: userData.username,
          email: userData.email,
          tier: userData.tier,
          role: userData.role,
        },
        whitelist: userData.whitelist,
        stats: {
          executions,
          daysActive,
          whitelistTier: userData.whitelist?.tier || 'Basic',
          referrals,
          balance: referralEarnings.toFixed(2),
        },
        recentActivity: formattedActivity,
      },
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Error fetching dashboard stats' },
      { status: 500 }
    )
  }
})

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
    }
  }

  return 'Just now'
}
