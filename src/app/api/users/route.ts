import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RegisteredUserRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  joinedDate: string;
  lastLogin?: string;
  status: string;
}

export async function GET() {
  try {
    let storedUsers: RegisteredUserRecord[] = [];
    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: 'registered_users' }
      });
      if (setting && setting.value) {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed)) storedUsers = parsed;
      }
    } catch (dbErr) {
      console.warn('Could not read registered_users from SystemSetting table:', dbErr);
    }

    // Also pull unique business creators from Business table so business owners are always listed
    try {
      const businesses = await prisma.business.findMany({
        select: { id: true, name: true, phone: true, createdBy: true, createdAt: true }
      });

      businesses.forEach((biz) => {
        const phone = biz.createdBy || biz.phone;
        if (!phone) return;
        const cleanPhone = phone.replace(/\D/g, '');
        if (!cleanPhone) return;

        const exists = storedUsers.some((u) => u.phone && u.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10)));
        if (!exists) {
          storedUsers.push({
            id: biz.id + 100000,
            name: `${biz.name} (Owner)`,
            phone: cleanPhone,
            email: `${cleanPhone}@majhboisar.in`,
            role: 'Merchant / Business Owner',
            joinedDate: biz.createdAt ? new Date(biz.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: 'Active'
          });
        }
      });
    } catch (bErr) {
      console.warn('Could not query businesses for user sync:', bErr);
    }

    return NextResponse.json({ success: true, users: storedUsers });
  } catch (error) {
    console.error('Error fetching registered users:', error);
    return NextResponse.json({ success: false, users: [], error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, role } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    let usersList: RegisteredUserRecord[] = [];

    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: 'registered_users' }
      });
      if (setting && setting.value) {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed)) usersList = parsed;
      }
    } catch (readErr) {
      console.warn('Error reading existing users list from SystemSetting:', readErr);
    }

    const existingIndex = usersList.findIndex((u) => 
      u.phone && u.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10))
    );

    const nowIso = new Date().toISOString();
    const todayDate = nowIso.split('T')[0];

    if (existingIndex >= 0) {
      usersList[existingIndex] = {
        ...usersList[existingIndex],
        name: name || usersList[existingIndex].name || 'Registered Citizen',
        email: email || usersList[existingIndex].email || `${cleanPhone}@majhboisar.in`,
        role: role || usersList[existingIndex].role || 'Registered User',
        lastLogin: nowIso,
        status: 'Active'
      };
    } else {
      const newUser: RegisteredUserRecord = {
        id: Date.now(),
        name: name || 'Registered Citizen',
        phone: cleanPhone,
        email: email || `${cleanPhone}@majhboisar.in`,
        role: role || 'Registered User',
        joinedDate: todayDate,
        lastLogin: nowIso,
        status: 'Active'
      };
      usersList.unshift(newUser);
    }

    // Persist to central Prisma database
    try {
      await prisma.systemSetting.upsert({
        where: { key: 'registered_users' },
        update: { value: JSON.stringify(usersList) },
        create: { key: 'registered_users', value: JSON.stringify(usersList) }
      });
    } catch (saveErr) {
      console.warn('Error upserting registered_users into SystemSetting:', saveErr);
    }

    return NextResponse.json({ success: true, users: usersList });
  } catch (error) {
    console.error('Error saving registered user:', error);
    return NextResponse.json({ error: 'Failed to save user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userIds } = await request.json();
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'userIds array is required' }, { status: 400 });
    }

    let usersList: RegisteredUserRecord[] = [];
    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: 'registered_users' }
      });
      if (setting && setting.value) {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed)) usersList = parsed;
      }
    } catch {
      // ignore
    }

    const updated = usersList.filter((u) => !userIds.includes(u.id));

    try {
      await prisma.systemSetting.upsert({
        where: { key: 'registered_users' },
        update: { value: JSON.stringify(updated) },
        create: { key: 'registered_users', value: JSON.stringify(updated) }
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, users: updated });
  } catch (error) {
    console.error('Error deleting users:', error);
    return NextResponse.json({ error: 'Failed to delete users' }, { status: 500 });
  }
}
