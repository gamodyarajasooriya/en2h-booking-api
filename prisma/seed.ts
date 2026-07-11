import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding initial sample services...');

  // Upsert ensures data won't duplicate if script runs multiple times
  await prisma.service.upsert({
    where: { id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' },
    update: {},
    create: {
      id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      title: 'Hair Cut & Styling',
      description: 'Premium hair styling, wash and conditioning.',
      duration: 45,
      price: 35.00,
      isActive: true,
    },
  });

  await prisma.service.upsert({
    where: { id: '7ca7b810-9dad-11d1-80b4-00c04fd430c9' },
    update: {},
    create: {
      id: '7ca7b810-9dad-11d1-80b4-00c04fd430c9',
      title: 'Eco Car Wash',
      description: 'Full exterior wash, vacuuming and interior polish.',
      duration: 60,
      price: 50.00,
      isActive: true,
    },
  });

  console.log('Database seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
