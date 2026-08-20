import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Removing all dummy data except Parks...');

  // Get all non-park business IDs
  const nonParks = await prisma.business.findMany({
    where: { category: { not: 'Parks' } },
    select: { id: true, name: true }
  });

  console.log(`Found ${nonParks.length} non-park businesses to delete:`);
  nonParks.forEach(b => console.log(` - ${b.name}`));

  const ids = nonParks.map(b => b.id);

  if (ids.length === 0) {
    console.log('Nothing to delete!');
    return;
  }

  // Delete related data first (foreign key constraints)
  await prisma.jobApplication.deleteMany({ where: { job: { businessId: { in: ids } } } });
  await prisma.job.deleteMany({ where: { businessId: { in: ids } } });
  await prisma.fAQ.deleteMany({ where: { businessId: { in: ids } } });
  await prisma.lead.deleteMany({ where: { businessId: { in: ids } } });
  await prisma.review.deleteMany({ where: { businessId: { in: ids } } });
  await prisma.product.deleteMany({ where: { businessId: { in: ids } } });
  await prisma.service.deleteMany({ where: { businessId: { in: ids } } });

  // Now delete the businesses themselves
  const deleted = await prisma.business.deleteMany({
    where: { id: { in: ids } }
  });

  console.log(`\n✅ Deleted ${deleted.count} dummy businesses.`);
  console.log('Parks are kept intact.');

  // Show remaining
  const remaining = await prisma.business.findMany({ select: { id: true, name: true, category: true } });
  console.log(`\nRemaining in DB (${remaining.length}):`);
  remaining.forEach(b => console.log(` ✓ [${b.category}] ${b.name}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
