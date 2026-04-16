import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

// PUT /api/admin/users/[id] - Update user (admin only)
export const PUT = requireAdmin(async (
  request: NextRequest,
  adminUser: any,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json()
    const { role, tier } = body

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent self-deletion or role change
    if (params.id === adminUser.userId) {
      return NextResponse.json(
        { error: 'Cannot modify your own account' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: {
        ...(role && { role }),
        ...(tier && { tier }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        tier: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Update whitelist if tier changed
    if (tier) {
      await db.whitelist.upsert({
        where: { userId: params.id },
        create: {
          userId: params.id,
          tier,
          active: true,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
        update: {
          tier,
          active: true,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    })

  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: 'Error updating user' },
      { status: 500 }
    )
  }
})

// DELETE /api/admin/users/[id] - Delete user (admin only)
export const DELETE = requireAdmin(async (
  request: NextRequest,
  adminUser: any,
  { params }: { params: { id: string } }
) => {
  try {
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent self-deletion
    if (params.id === adminUser.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Delete user (cascade will handle related records)
    await db.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })

  } catch (error) {
    console.error('User delete error:', error)
    return NextResponse.json(
      { error: 'Error deleting user' },
      { status: 500 }
    )
  }
})
