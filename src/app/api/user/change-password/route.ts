import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, verifyPassword, hashPassword } from '@/lib/auth'

export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Get current user data with password
    const currentUser = await db.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        password: true,
      },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, currentUser.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password
    await db.user.update({
      where: { id: user.userId },
      data: { password: hashedPassword },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        userId: user.userId,
        action: 'password_changed',
        status: 'success',
        details: 'User changed their password',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Error changing password' },
      { status: 500 }
    )
  }
})
