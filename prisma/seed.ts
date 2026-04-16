import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@beulrock.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@beulrock.com',
      password: hashedPassword,
      role: 'admin',
      tier: 'Ultimate',
    },
  })
  console.log('✅ Admin user created:', admin.username)

  // Create test user
  const userPassword = await hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@beulrock.com' },
    update: {},
    create: {
      username: 'beulrock',
      email: 'user@beulrock.com',
      password: userPassword,
      role: 'user',
      tier: 'Premium',
    },
  })
  console.log('✅ Test user created:', user.username)

  // Create whitelists
  await prisma.whitelist.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      tier: 'Ultimate',
      active: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.whitelist.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      tier: 'Premium',
      active: true,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  })
  console.log('✅ Whitelists created')

  // Create games
  const games = [
    {
      name: 'Blox Fruits',
      placeId: '2753915549',
      status: 'active',
      players: 15400,
      description: 'Search for fruits and become the strongest player',
    },
    {
      name: 'Pet Simulator 99',
      placeId: '8737869170',
      status: 'active',
      players: 8900,
      description: 'Collect pets and unlock new worlds',
    },
    {
      name: 'Brookhaven RP',
      placeId: '4924922222',
      status: 'active',
      players: 45000,
      description: 'Roleplay in Brookhaven city',
    },
    {
      name: 'Da Hood',
      placeId: '2788229376',
      status: 'active',
      players: 12000,
      description: 'Enter Da Hood and become a legend',
    },
    {
      name: 'Tower of Hell',
      placeId: '1962086868',
      status: 'active',
      players: 7500,
      description: 'Race to the top of the tower',
    },
    {
      name: 'Murder Mystery 2',
      placeId: '142823291',
      status: 'active',
      players: 5600,
      description: 'Find the murderer or escape',
    },
  ]

  for (const game of games) {
    const thumbnailUrl = `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${game.placeId}&size=512x512&format=Png&isCircular=false`
    await prisma.game.upsert({
      where: { placeId: game.placeId },
      update: {},
      create: {
        ...game,
        thumbnailUrl,
      },
    })
  }
  console.log(`✅ Created ${games.length} games`)

  // Create license keys
  const keys = [
    { code: 'PREMIUM-2024', tier: 'Premium' },
    { code: 'ULTIMATE-2024', tier: 'Ultimate' },
    { code: 'BASIC-2024', tier: 'Basic' },
    { code: 'VIP-SPECIAL', tier: 'Ultimate' },
  ]

  for (const key of keys) {
    await prisma.key.upsert({
      where: { code: key.code },
      update: {},
      create: {
        ...key,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })
  }
  console.log(`✅ Created ${keys.length} license keys`)

  // Create some scripts
  const scripts = [
    {
      name: 'Auto Farm - Blox Fruits',
      code: '-- Auto Farm Script\nprint("Auto Farm Loaded")',
      description: 'Automatically farm fruits and levels',
      category: 'auto_farm',
      verified: true,
    },
    {
      name: 'Dark Dex',
      code: '-- Dark Dex Script\nprint("Dark Dex Loaded")',
      description: 'Advanced decompiler and explorer',
      category: 'utility',
      verified: true,
    },
    {
      name: 'Remote Spy',
      code: '-- Remote Spy Script\nprint("Remote Spy Loaded")',
      description: 'Monitor all remote events and functions',
      category: 'utility',
      verified: true,
    },
    {
      name: 'Infinite Jump',
      code: '-- Infinite Jump Script\nprint("Infinite Jump Loaded")',
      description: 'Jump infinitely in any game',
      category: 'utility',
      verified: false,
    },
  ]

  const bloxFruits = await prisma.game.findUnique({ where: { placeId: '2753915549' } })

  for (const script of scripts) {
    await prisma.script.upsert({
      where: { id: script.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: script.name.toLowerCase().replace(/\s+/g, '-'),
        ...script,
        gameId: bloxFruits?.id || null,
        userId: admin.id,
      },
    })
  }
  console.log(`✅ Created ${scripts.length} scripts`)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
