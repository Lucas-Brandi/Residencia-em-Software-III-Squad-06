const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping creation');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created successfully:');
  console.log(`Username: ${admin.username}`);
  console.log(`Role: ${admin.role}`);
  console.log('Default password: Admin123!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });