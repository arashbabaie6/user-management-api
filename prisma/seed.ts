import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // only create a new user if no user matches the "where" condition
  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@leovegas.com' },
    update: {},
    create: {
      email: 'admin@leovegas.com',
      name: 'Admin',
      password: 'admin1234',
      access_token: '',
      role: 'ADMIN'
    },
  });

  console.log({ admin1 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
