import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Simulate analytics logging; assume req.body has { workoutId }
  await new Promise((res) => setTimeout(res, 150));
  // For demo, accept the data but respond OK
  return NextResponse.json({ status: 'ok' });
}