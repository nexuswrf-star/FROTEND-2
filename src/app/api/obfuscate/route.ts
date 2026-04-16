import { NextRequest, NextResponse } from 'next/server'
import { obfuscateLuaCode } from '@/lib/obfuscator'
import { requireAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

export const POST = requireAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const { code, options } = body

    // Validate input
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      )
    }

    if (!options || typeof options !== 'object') {
      return NextResponse.json(
        { error: 'Options are required' },
        { status: 400 }
      )
    }

    // Validate at least one option is selected
    const hasActiveOption = Object.values(options).some((v: any) => v === true)
    if (!hasActiveOption) {
      return NextResponse.json(
        { error: 'At least one obfuscation option must be selected' },
        { status: 400 }
      )
    }

    // Check user tier for advanced features
    if (user.tier === 'Basic') {
      // Basic users can't use advanced features
      if (options.vm || options.antitamp) {
        return NextResponse.json(
          { error: 'VM and Anti-Tamper require Premium or Ultimate tier' },
          { status: 403 }
        )
      }
    }

    // Log obfuscation activity
    await db.activityLog.create({
      data: {
        userId: user.userId,
        action: 'code_obfuscated',
        status: 'success',
        details: `Options: ${Object.keys(options).filter(k => options[k as keyof typeof options]).join(', ')}`,
      },
    })

    // Obfuscate the code
    const startTime = Date.now()
    const obfuscatedCode = obfuscateLuaCode(code, options)
    const processingTime = Date.now() - startTime

    // Calculate statistics
    const originalSize = Buffer.byteLength(code, 'utf8')
    const obfuscatedSize = Buffer.byteLength(obfuscatedCode, 'utf8')
    const sizeChange = ((obfuscatedSize - originalSize) / originalSize * 100).toFixed(1)

    return NextResponse.json({
      success: true,
      data: {
        obfuscatedCode,
        statistics: {
          originalSize,
          obfuscatedSize,
          sizeChange: `${sizeChange}%`,
          processingTime: `${processingTime}ms`,
          optionsUsed: Object.keys(options).filter(k => options[k as keyof typeof options]),
        },
      },
    })

  } catch (error) {
    console.error('Obfuscation error:', error)
    return NextResponse.json(
      { error: 'Error obfuscating code' },
      { status: 500 }
    )
  }
})
