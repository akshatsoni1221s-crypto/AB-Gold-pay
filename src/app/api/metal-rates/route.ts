import { NextResponse } from 'next/server';
import { fetchMetalRates } from '@/lib/metal-rates';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const rates = await fetchMetalRates();
    return NextResponse.json({ success: true, data: rates });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch rates' }, { status: 500 });
  }
}
