import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting database seed...');

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' },
  });

  if (existingAdmin) {
    console.log(' Admin user already exists, skipping creation');
    return;
  }

  // Hash the default password securely
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  // Create default admin user
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(' Admin user created successfully:');
  console.log(`   Username: ${admin.username}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   Default password: Admin123!`);
  console.log('  Please change the default password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
