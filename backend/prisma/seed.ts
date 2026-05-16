import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Employee',
      email: 'john@example.com',
      role: 'EMPLOYEE'
    }
  });
  console.log('Created user:', user);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
