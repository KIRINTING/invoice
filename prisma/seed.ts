import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = "admin@invoice.local" // คุณสามารถเปลี่ยนได้
  const existingUser = await prisma.user.findUnique({ where: { email } })
  
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("admin123", 10)
    await prisma.user.create({
      data: {
        name: "Administrator",
        email: email,
        password: hashedPassword,
        role: "ADMIN"
      }
    })
    console.log(`Admin user created: ${email} / admin123`)
  } else {
    console.log("Admin user already exists")
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

