import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

// GET /api/scripts - List all scripts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const gameId = searchParams.get('gameId')
    const verified = searchParams.get('verified')
    const userId = searchParams.get('userId')

    const where: any = {}

    if (category) {
      where.category = category
    }

    if (gameId) {
      where.gameId = gameId
    }

    if (verified === 'true') {
      where.verified = true
    }

    if (userId) {
      where.userId = userId
    }

    const scripts = await db.script.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
            placeId: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: scripts,
    })

  } catch (error) {
    console.error('Scripts fetch error:', error)
    return NextResponse.json(
      { error: 'Error fetching scripts' },
      { status: 500 }
    )
  }
}

// POST /api/scripts - Create new script (authenticated)
export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const { name, code, description, category, gameId } = body

    // Validate input
    if (!name || !code || !category) {
      return NextResponse.json(
        { error: 'Name, code, and category are required' },
        { status: 400 }
      )
    }

    // Create script
    const script = await db.script.create({
      data: {
        name,
        code,
        description: description || '',
        category,
        gameId: gameId || null,
        userId: user.userId,
        verified: false, // Default to not verified
      },
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

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.userId,
        action: 'script_created',
        status: 'success',
        details: `Script: ${name}`,
      },
    })

    return NextResponse.json({
      success: true,
      data: script,
    })

  } catch (error) {
    console.error('Script creation error:', error)
    return NextResponse.json(
      { error: 'Error creating script' },
      { status: 500 }
    )
  }
})
