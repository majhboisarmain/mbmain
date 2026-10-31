import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const phone = body?.phone || body?.mobileNumber;
    const otp = body?.otp || body?.code;

    if (!phone || phone.toString().replace(/\D/g, '').length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Valid 10-digit mobile number is required' },
        { status: 400 }
      );
    }

    if (!otp || otp.toString().trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 6-digit OTP' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);
    const cleanOtp = otp.toString().trim();

    // Fetch the OTP stored securely in the database
    const setting = await prisma.systemSetting.findUnique({
      where: { key: `otp_${cleanPhone}` }
    });

    if (!setting || !setting.value) {
      return NextResponse.json(
        { success: false, error: 'Koi active OTP nahi mila. Kripya "Resend OTP" par click karein.' },
        { status: 400 }
      );
    }

    let record: { code: string; expiresAt: number; attempts: number; createdAt: number };
    try {
      record = JSON.parse(setting.value);
    } catch {
      await prisma.systemSetting.delete({ where: { key: `otp_${cleanPhone}` } }).catch(() => {});
      return NextResponse.json(
        { success: false, error: 'Invalid OTP session. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check expiration (5 minutes)
    if (Date.now() > record.expiresAt) {
      await prisma.systemSetting.delete({ where: { key: `otp_${cleanPhone}` } }).catch(() => {});
      return NextResponse.json(
        { success: false, error: 'Yeh OTP expire ho chuka hai (valid for 5 mins). Kripya naya OTP mangwayein.' },
        { status: 400 }
      );
    }

    // Check maximum brute-force attempts
    if (record.attempts >= 5) {
      await prisma.systemSetting.delete({ where: { key: `otp_${cleanPhone}` } }).catch(() => {});
      return NextResponse.json(
        { success: false, error: 'Bahut zyada galat attempts kiye gaye. Suraksha ke liye naya OTP mangwayein.' },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (record.code !== cleanOtp) {
      record.attempts += 1;
      await prisma.systemSetting.update({
        where: { key: `otp_${cleanPhone}` },
        data: { value: JSON.stringify(record) }
      });
      const remainingAttempts = 5 - record.attempts;
      return NextResponse.json(
        { 
          success: false, 
          error: `Galat OTP enter kiya hai. Kripya mobile SMS check karein. (${remainingAttempts} attempts bache hain)` 
        },
        { status: 400 }
      );
    }

    // SUCCESS: Immediately burn the OTP so it can NEVER be reused or intercepted!
    await prisma.systemSetting.delete({
      where: { key: `otp_${cleanPhone}` }
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      phone: cleanPhone
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Server error verifying OTP. Please try again.' },
      { status: 500 }
    );
  }
}
