const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: { url: "file:/home/z/my-project/db/custom.db" }
  }
})

async function main() {
  try {
    const user = await prisma.user.update({
      where: { username: 'superadmin' },
      data: { role: 'ADMIN' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        tier: true,
      },
    })
    console.log('✅ User updated to admin:', user)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
