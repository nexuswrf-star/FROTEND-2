import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

// GET /api/admin/users - List all users (admin only)
export const GET = requireAdmin(async (request: NextRequest, user: any) => {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const role = searchParams.get('role')
    const tier = searchParams.get('tier')

    const where: any = {}

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (role) {
      where.role = role
    }

    if (tier) {
      where.tier = tier
    }

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        tier: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            scripts: true,
            keys: true,
            activityLogs: true,
          },
        },
        whitelist: {
          select: {
            active: true,
            expiresAt: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: users,
    })

  } catch (error) {
    console.error('Admin users fetch error:', error)
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    )
  }
})
