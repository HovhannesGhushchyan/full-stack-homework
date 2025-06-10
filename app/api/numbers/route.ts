import { NextRequest, NextResponse } from 'next/server';
import { numbersQueries } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { value } = await request.json();
    
    // Validate input
    if (typeof value !== 'number') {
      return NextResponse.json({ error: 'Value must be a number' }, { status: 400 });
    }
    
    // Add number using raw SQL
    const result = await numbersQueries.addNumber(value);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error adding number:', error);
    return NextResponse.json({ error: 'Failed to add number' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get all numbers using raw SQL
    const numbers = await numbersQueries.getAllNumbers();
    
    return NextResponse.json(numbers);
  } catch (error) {
    console.error('Error fetching numbers:', error);
    return NextResponse.json({ error: 'Failed to fetch numbers' }, { status: 500 });
  }
}