import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/games - List all games
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const games = await db.game.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            scripts: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: games,
    })

  } catch (error) {
    console.error('Games fetch error:', error)
    return NextResponse.json(
      { error: 'Error fetching games' },
      { status: 500 }
    )
  }
}

// POST /api/games - Create new game (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, placeId, status, description } = body

    // Validate input
    if (!name || !placeId) {
      return NextResponse.json(
        { error: 'Name and placeId are required' },
        { status: 400 }
      )
    }

    // Check if game already exists
    const existingGame = await db.game.findUnique({
      where: { placeId },
    })

    if (existingGame) {
      return NextResponse.json(
        { error: 'Game with this placeId already exists' },
        { status: 409 }
      )
    }

    // Generate thumbnail URL from Roblox
    const thumbnailUrl = `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${placeId}&size=512x512&format=Png&isCircular=false`

    // Create game
    const game = await db.game.create({
      data: {
        name,
        placeId,
        thumbnailUrl,
        status: status || 'active',
        description: description || '',
        players: 0,
      },
    })

    return NextResponse.json({
      success: true,
      data: game,
    })

  } catch (error) {
    console.error('Game creation error:', error)
    return NextResponse.json(
      { error: 'Error creating game' },
      { status: 500 }
    )
  }
}
