import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminRequest } from '@/lib/auth';
import { unauthorizedResponse } from '@/lib/authGuard';

export const dynamic = 'force-dynamic';

// Allowed public advertising configuration keys (strictly excludes any sensitive keys like otp_*, session_*, user_*)
const ALLOWED_SETTING_KEYS = [
  'sliderMultiplier',
  'resultsMultiplier',
  'allMultiplier',
  'baseDailyBudget',
  'sponsoredMultiplier'
];

export async function GET() {
  try {
    const rawSettings = await prisma.systemSetting.findMany({
      where: {
        key: { in: ALLOWED_SETTING_KEYS }
      }
    });
    
    // Map list to key-value record strictly from whitelisted keys
    const settings: Record<string, string> = {
      sliderMultiplier: '2.0',
      resultsMultiplier: '1.5',
      allMultiplier: '3.0',
      baseDailyBudget: '100.0',
      sponsoredMultiplier: '1.0'
    };

    rawSettings.forEach(s => {
      if (ALLOWED_SETTING_KEYS.includes(s.key)) {
        settings[s.key] = s.value;
      }
    });

    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only verified Super Admin can modify system advertising settings
    if (!isAdminRequest(req)) {
      return unauthorizedResponse('Super Admin authentication required to update system settings');
    }

    const body = await req.json();
    
    if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
      // Save only whitelisted setting keys
      const promises = Object.entries(body)
        .filter(([key]) => ALLOWED_SETTING_KEYS.includes(key))
        .map(([key, value]) => {
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
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
