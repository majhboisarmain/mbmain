import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const rawSettings = await prisma.systemSetting.findMany();
    
    // Map list to key-value record
    const settings: Record<string, string> = {
      sliderMultiplier: '2.0',
      resultsMultiplier: '1.5',
      allMultiplier: '3.0',
      baseDailyBudget: '100.0',
      sponsoredMultiplier: '1.0'
    };

    rawSettings.forEach(s => {
      settings[s.key] = s.value;
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Array of { key, value } or a key-value object
    
    if (typeof body === 'object' && !Array.isArray(body)) {
      // Save all key-values
      const promises = Object.entries(body).map(([key, value]) => {
        return prisma.systemSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) }
        });
      });
      await Promise.all(promises);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
