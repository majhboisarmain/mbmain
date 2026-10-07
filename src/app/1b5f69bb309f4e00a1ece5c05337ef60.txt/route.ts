import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('1b5f69bb309f4e00a1ece5c05337ef60', {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
