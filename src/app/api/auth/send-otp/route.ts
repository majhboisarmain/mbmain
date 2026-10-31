import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const phone = body?.phone || body?.mobileNumber;

    if (!phone || phone.toString().replace(/\D/g, '').length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Valid 10-digit mobile number is required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);

    // Rate Limiting: Prevent SMS spamming (minimum 30 seconds cooldown between OTP requests for the same number)
    try {
      const existingSetting = await prisma.systemSetting.findUnique({
        where: { key: `otp_${cleanPhone}` }
      });
      if (existingSetting) {
        const record = JSON.parse(existingSetting.value);
        if (record?.createdAt && Date.now() - record.createdAt < 30 * 1000) {
          const waitSecs = Math.ceil((30 * 1000 - (Date.now() - record.createdAt)) / 1000);
          return NextResponse.json(
            { success: false, error: `Kripya naya OTP mangwane ke liye ${waitSecs} seconds wait karein.` },
            { status: 429 }
          );
        }
      }
    } catch (e) {
      console.warn('Rate limit check warning:', e);
    }

    // Cryptographically secure 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // Store OTP securely on server with 5 minutes expiration and 0 attempts
    await prisma.systemSetting.upsert({
      where: { key: `otp_${cleanPhone}` },
      update: {
        value: JSON.stringify({
          code: otpCode,
          expiresAt: Date.now() + 5 * 60 * 1000,
          attempts: 0,
          createdAt: Date.now()
        })
      },
      create: {
        key: `otp_${cleanPhone}`,
        value: JSON.stringify({
          code: otpCode,
          expiresAt: Date.now() + 5 * 60 * 1000,
          attempts: 0,
          createdAt: Date.now()
        })
      }
    });

    // Spring Edge SMS Credentials & Approved Jio DLT Template
    const apiKey = process.env.SPRING_EDGE_API_KEY || '15391s51i071ueju468t1598a14p17c1pb2';
    const senderId = process.env.SPRING_EDGE_SENDER_ID || 'MAJHBO';
    const dltTemplateId = process.env.SPRING_EDGE_DLT_TEMPLATE_ID || '1277178644966258377';
    const dltEntityId = process.env.SPRING_EDGE_DLT_ENTITY_ID || '1201178573478115376';
    
    // Exact Jio Approved Message: "Your MajhBoisar OTP: {#number#}. Do not share."
    const customTemplate = process.env.SPRING_EDGE_MESSAGE_TEMPLATE;
    const message = customTemplate 
      ? customTemplate
          .replace('{otp}', otpCode)
          .replace('{#number#}', otpCode)
          .replace('{#var#}', otpCode)
          .replace('{%var%}', otpCode)
      : `Your MajhBoisar OTP: ${otpCode}. Do not share.`;

    let smsDispatched = false;

    if (apiKey) {
      try {
        const queryParams: Record<string, string> = {
          apikey: apiKey,
          sender: senderId,
          to: cleanPhone,
          message: message,
          flash: '0',
          format: 'json'
        };

        if (dltTemplateId) {
          queryParams.dlt_te_id = dltTemplateId;
          queryParams.template_id = dltTemplateId;
          queryParams.DLT_TE_ID = dltTemplateId;
        }
        if (dltEntityId) {
          queryParams.dlt_pe_id = dltEntityId;
          queryParams.entity_id = dltEntityId;
          queryParams.PE_ID = dltEntityId;
        }

        const springEdgeUrl = `https://instantalerts.co/api/web/send?${new URLSearchParams(queryParams).toString()}`;
        
        const response = await fetch(springEdgeUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Majh-Boisar-Gateway/2.0',
            'Accept': 'application/json'
          },
          cache: 'no-store'
        });

        const textRes = await response.text();
        console.log(`[Spring Edge SMS] Dispatched to ${cleanPhone}:`, textRes);
        smsDispatched = true;
      } catch (smsError: any) {
        console.error('[Spring Edge SMS Dispatch Error]:', smsError);
      }
    }

    // STRICT SECURITY: NEVER SEND THE OTP IN THE RESPONSE!
    return NextResponse.json({
      success: true,
      message: `OTP sent successfully via SMS to +91 ${cleanPhone}`,
      smsDispatched
    });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Server error sending OTP. Please try again.' },
      { status: 500 }
    );
  }
}
