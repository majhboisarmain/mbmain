import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export interface DeviceSession {
  id: string;
  phone: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  deviceBrand: string;
  browser: string;
  ip?: string;
  createdAt: number;
  lastActive: number;
}

export function parseDeviceFromUA(ua: string): { deviceType: 'Mobile' | 'Desktop' | 'Tablet'; deviceBrand: string; browser: string } {
  let deviceType: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  let deviceBrand = 'Computer';
  let browser = 'Browser';

  if (/iPad|Tablet/i.test(ua)) {
    deviceType = 'Tablet';
    deviceBrand = /iPad/i.test(ua) ? 'iPad' : 'Tablet Device';
  } else if (/iPhone/i.test(ua)) {
    deviceType = 'Mobile';
    deviceBrand = 'Apple iPhone';
  } else if (/Android/i.test(ua)) {
    deviceType = 'Mobile';
    deviceBrand = 'Android Phone';
  } else if (/Windows/i.test(ua)) {
    deviceType = 'Desktop';
    deviceBrand = 'Windows PC';
  } else if (/Macintosh|Mac OS/i.test(ua)) {
    deviceType = 'Desktop';
    deviceBrand = 'Apple Mac';
  } else if (/Linux/i.test(ua)) {
    deviceType = 'Desktop';
    deviceBrand = 'Linux PC';
  }

  if (/Chrome|CriOS/i.test(ua) && !/Edg/i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox|FxiOS/i.test(ua)) {
    browser = 'Mozilla Firefox';
  } else if (/Edg/i.test(ua)) {
    browser = 'Microsoft Edge';
  }

  return { deviceType, deviceBrand, browser };
}

// GET: Fetch active sessions for a phone number
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPhone = searchParams.get('phone');
    const clientSessionId = searchParams.get('sessionId') || request.headers.get('x-session-id');

    if (!rawPhone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }

    const settingKey = `sessions_${cleanPhone}`;
    const setting = await prisma.systemSetting.findUnique({
      where: { key: settingKey }
    });

    let sessions: DeviceSession[] = [];
    if (setting?.value) {
      try {
        sessions = JSON.parse(setting.value);
      } catch {
        sessions = [];
      }
    }

    // Filter out sessions older than 30 days
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const activeSessions = sessions.filter(s => (now - s.lastActive) < THIRTY_DAYS_MS);

    // Update lastActive for current session if found
    if (clientSessionId) {
      const current = activeSessions.find(s => s.id === clientSessionId);
      if (current) {
        current.lastActive = now;
        await prisma.systemSetting.upsert({
          where: { key: settingKey },
          update: { value: JSON.stringify(activeSessions) },
          create: { key: settingKey, value: JSON.stringify(activeSessions) }
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      success: true,
      currentSessionValid: clientSessionId ? activeSessions.some(s => s.id === clientSessionId) : true,
      sessions: activeSessions.map(s => ({
        id: s.id,
        deviceType: s.deviceType,
        deviceBrand: s.deviceBrand,
        browser: s.browser,
        ip: s.ip ? `${s.ip.slice(0, 7)}***` : undefined,
        createdAt: s.createdAt,
        lastActive: s.lastActive,
        isCurrent: Boolean(clientSessionId && s.id === clientSessionId)
      }))
    });
  } catch (error: any) {
    console.error('[Sessions GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

// POST: Manage sessions (register new session, revoke one, or revoke all others)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, phone: rawPhone, sessionId, targetSessionId } = body;

    if (!rawPhone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    const settingKey = `sessions_${cleanPhone}`;

    const setting = await prisma.systemSetting.findUnique({
      where: { key: settingKey }
    });

    let sessions: DeviceSession[] = [];
    if (setting?.value) {
      try {
        sessions = JSON.parse(setting.value);
      } catch {
        sessions = [];
      }
    }

    const now = Date.now();

    if (action === 'create') {
      const ua = request.headers.get('user-agent') || '';
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '';
      const parsedUA = parseDeviceFromUA(ua);

      const newSession: DeviceSession = {
        id: crypto.randomUUID(),
        phone: cleanPhone,
        deviceType: parsedUA.deviceType,
        deviceBrand: parsedUA.deviceBrand,
        browser: parsedUA.browser,
        ip,
        createdAt: now,
        lastActive: now,
      };

      // In single active device policy:
      // Option: Keep new session as primary, mark older sessions terminated, or retain newest
      // We keep newest as active and retain up to 3 for history/revocation
      const updated = [newSession, ...sessions.filter(s => s.id !== newSession.id)].slice(0, 5);

      await prisma.systemSetting.upsert({
        where: { key: settingKey },
        update: { value: JSON.stringify(updated) },
        create: { key: settingKey, value: JSON.stringify(updated) }
      });

      return NextResponse.json({
        success: true,
        sessionId: newSession.id,
        session: newSession
      });
    }

    if (action === 'logout_all_others') {
      if (!sessionId) {
        return NextResponse.json({ error: 'Current sessionId is required' }, { status: 400 });
      }

      // Keep ONLY the current session, delete all others!
      const retained = sessions.filter(s => s.id === sessionId);

      await prisma.systemSetting.upsert({
        where: { key: settingKey },
        update: { value: JSON.stringify(retained) },
        create: { key: settingKey, value: JSON.stringify(retained) }
      });

      return NextResponse.json({
        success: true,
        message: 'All other device sessions have been logged out successfully.',
        retainedCount: retained.length
      });
    }

    if (action === 'logout_device') {
      if (!targetSessionId) {
        return NextResponse.json({ error: 'Target sessionId is required' }, { status: 400 });
      }

      const filtered = sessions.filter(s => s.id !== targetSessionId);

      await prisma.systemSetting.upsert({
        where: { key: settingKey },
        update: { value: JSON.stringify(filtered) },
        create: { key: settingKey, value: JSON.stringify(filtered) }
      });

      return NextResponse.json({
        success: true,
        message: 'Device session removed successfully.'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('[Sessions POST Error]:', error);
    return NextResponse.json({ error: 'Failed to update sessions' }, { status: 500 });
  }
}

