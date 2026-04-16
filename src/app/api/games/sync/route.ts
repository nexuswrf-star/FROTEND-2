import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/games/sync - Sync game data from Roblox
export async function POST(request: NextRequest) {
  try {
    const games = await db.game.findMany()

    const updatedGames = []

    for (const game of games) {
      try {
        // Fetch game data from Roblox API
        const response = await fetch(
          `https://games.roblox.com/v1/games?universeIds=${game.placeId}`
        )
        const data = await response.json()

        if (data.data && data.data.length > 0) {
          const robloxGame = data.data[0]
          const playing = robloxGame.playing || 0

          // Update game in database
          const updated = await db.game.update({
            where: { id: game.id },
            data: {
              players: playing,
            },
          })

          updatedGames.push(updated)
        }
      } catch (error) {
        console.error(`Error syncing game ${game.name}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${updatedGames.length} games`,
      data: updatedGames,
    })

  } catch (error) {
    console.error('Games sync error:', error)
    return NextResponse.json(
      { error: 'Error syncing games' },
      { status: 500 }
    )
  }
}
