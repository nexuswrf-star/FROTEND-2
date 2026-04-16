import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/middleware'

// GET /api/scripts/[id] - Get script by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const script = await db.script.findUnique({
      where: { id: params.id },
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

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await db.script.update({
      where: { id: params.id },
      data: {
        views: { increment: 1 },
      },
    })

    return NextResponse.json({
      success: true,
      data: script,
    })

  } catch (error) {
    console.error('Script fetch error:', error)
    return NextResponse.json(
      { error: 'Error fetching script' },
      { status: 500 }
    )
  }
}

// PUT /api/scripts/[id] - Update script (owner only or admin)
export const PUT = requireAuth(async (
  request: NextRequest,
  user: any,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json()
    const { name, code, description, category, gameId } = body

    // Check if script exists
    const existingScript = await db.script.findUnique({
      where: { id: params.id },
    })

    if (!existingScript) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    // Check ownership or admin
    if (existingScript.userId !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to update this script' },
        { status: 403 }
      )
    }

    // Update script
    const script = await db.script.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(gameId !== undefined && { gameId }),
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
        action: 'script_updated',
        status: 'success',
        details: `Script: ${script.name}`,
      },
    })

    return NextResponse.json({
      success: true,
      data: script,
    })

  } catch (error) {
    console.error('Script update error:', error)
    return NextResponse.json(
      { error: 'Error updating script' },
      { status: 500 }
    )
  }
})

// DELETE /api/scripts/[id] - Delete script (owner only or admin)
export const DELETE = requireAuth(async (
  request: NextRequest,
  user: any,
  { params }: { params: { id: string } }
) => {
  try {
    // Check if script exists
    const existingScript = await db.script.findUnique({
      where: { id: params.id },
    })

    if (!existingScript) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    // Check ownership or admin
    if (existingScript.userId !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to delete this script' },
        { status: 403 }
      )
    }

    // Delete script
    await db.script.delete({
      where: { id: params.id },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.userId,
        action: 'script_deleted',
        status: 'success',
        details: `Script: ${existingScript.name}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Script deleted successfully',
    })

  } catch (error) {
    console.error('Script delete error:', error)
    return NextResponse.json(
      { error: 'Error deleting script' },
      { status: 500 }
    )
  }
})
