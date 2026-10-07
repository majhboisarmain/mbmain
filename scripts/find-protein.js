const { prisma } = require('../src/lib/db');

async function main() {
  const businesses = await prisma.business.findMany({
    where: {
      OR: [
        { name: { contains: 'Protein', mode: 'insensitive' } },
        { category: { contains: 'Protein', mode: 'insensitive' } },
        { description: { contains: 'Protein', mode: 'insensitive' } },
        { subcategory: { contains: 'Protein', mode: 'insensitive' } }
      ]
    }
  });

  console.log('FOUND PROTEIN BUSINESSES COUNT:', businesses.length);
  businesses.forEach(b => {
    console.log(`ID: ${b.id} | Name: "${b.name}" | Category: "${b.category}" | Subcategory: "${b.subcategory}" | Verified: ${b.verified}`);
  });
}

main().catch(console.error).finally(() => process.exit(0));
