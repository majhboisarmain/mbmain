import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadFile } from '@/lib/cloudinary';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);
    const body = await request.json();

    const { applicantName, applicantPhone, applicantEmail, resumeUrl, coverLetter } = body;

    if (!applicantName || !applicantPhone) {
      return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
    }

    let uploadedResumeUrl = resumeUrl;
    if (resumeUrl && resumeUrl.startsWith('data:')) {
      uploadedResumeUrl = await uploadFile(resumeUrl);
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        applicantName,
        applicantPhone,
        applicantEmail,
        resumeUrl: uploadedResumeUrl,
        coverLetter,
        status: 'Pending'
      }
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
