import { NextResponse } from 'next/server';
import { numbersQueries } from '@/lib/db';

export async function GET() {
  try {
    // Get adjacent number pairs using raw SQL
    const pairs = await numbersQueries.getAdjacentPairs();
    
    return NextResponse.json(pairs);
  } catch (error) {
    console.error('Error fetching number pairs:', error);
    return NextResponse.json({ error: 'Failed to fetch number pairs' }, { status: 500 });
  }
}