const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: { url: "file:/home/z/my-project/db/custom.db" }
  }
})

async function main() {
  try {
    // Cek user testuser
    const user = await prisma.user.findUnique({
      where: { username: 'testuser' },
      select: {
        id: true,
        username: true,
        email: true,
        tier: true,
        role: true,
      },
    })
    console.log('\n✅ User Info:')
    console.log(JSON.stringify(user, null, 2))

    // Cek whitelist
    const whitelist = await prisma.whitelist.findUnique({
      where: { userId: user.id },
    })
    console.log('\n✅ Whitelist Info:')
    console.log(JSON.stringify(whitelist, null, 2))

    // Cek key yang di-redeem
    const keys = await prisma.key.findMany({
      where: { code: 'PREMIUM-13E52T-E31MXZ' },
    })
    console.log('\n✅ Key Info:')
    console.log(JSON.stringify(keys[0], null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
