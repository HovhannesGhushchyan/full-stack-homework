import { NextRequest, NextResponse } from 'next/server';
import { gradesQueries } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { class: classType, value } = await request.json();
    
    // Validate input
    if (!classType || typeof value !== 'number') {
      return NextResponse.json({ error: 'Class and value are required' }, { status: 400 });
    }
    
    if (value < 0 || value > 100) {
      return NextResponse.json({ error: 'Grade must be between 0 and 100' }, { status: 400 });
    }
    
    // Add grade using raw SQL
    const result = await gradesQueries.addGrade(classType, value);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error adding grade:', error);
    return NextResponse.json({ error: 'Failed to add grade' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classType = searchParams.get('class');
    
    let grades;
    if (classType) {
      // Get grades by class using raw SQL
      grades = await gradesQueries.getGradesByClass(classType);
    } else {
      // Get all grades using raw SQL
      grades = await gradesQueries.getAllGrades();
    }
    
    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json({ error: 'Failed to fetch grades' }, { status: 500 });
  }
}