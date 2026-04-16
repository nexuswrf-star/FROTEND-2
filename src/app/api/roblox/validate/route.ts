import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Roblox Users API
    const response = await fetch(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=1`, {
      headers: {
        'accept': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to validate username' },
        { status: 500 }
      )
    }

    const data = await response.json()

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({
        valid: false,
        error: 'User not found',
      })
    }

    const robloxUser = data.data[0]

    // Get user thumbnail
    const thumbnailResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUser.id}&size=150x150&format=Png&isCircular=false`, {
      headers: {
        'accept': 'application/json',
      },
    })

    let thumbnail = ''
    if (thumbnailResponse.ok) {
      const thumbnailData = await thumbnailResponse.json()
      thumbnail = thumbnailData.data?.[0]?.imageUrl || ''
    }

    return NextResponse.json({
      valid: true,
      username: robloxUser.name,
      displayName: robloxUser.displayName,
      userId: robloxUser.id,
      thumbnail,
    })

  } catch (error) {
    console.error('Roblox validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
