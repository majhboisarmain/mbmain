import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'total_platform_visitors' },
    });
    const total = setting ? parseInt(setting.value, 10) : 4666;
    return NextResponse.json({ totalVisitors: isNaN(total) ? 4666 : total });
  } catch (error: any) {
    return NextResponse.json({ totalVisitors: 4666 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'total_platform_visitors' },
    });
    const current = setting ? parseInt(setting.value, 10) : 4666;
    const nextVal = (isNaN(current) ? 4666 : current) + 1;

    await prisma.systemSetting.upsert({
      where: { key: 'total_platform_visitors' },
      update: { value: String(nextVal) },
      create: { key: 'total_platform_visitors', value: String(nextVal) },
    });

    return NextResponse.json({ success: true, totalVisitors: nextVal });
  } catch (error: any) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
