import { NextRequest } from 'next/server';
import { POST, GET } from '../../app/api/grades/route';
import { gradesQueries } from '../../lib/db';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

// Mock the database queries
jest.mock('../../lib/db', () => ({
  gradesQueries: {
    addGrade: jest.fn(),
    getAllGrades: jest.fn(),
    getGradesByClass: jest.fn(),
  },
}));

describe('Grades API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/grades', () => {
    it('adds a grade successfully', async () => {
      // Mock the database response
      (gradesQueries.addGrade as jest.Mock).mockResolvedValue({ id: 1, class: 'Math', value: 85 });
      
      // Create a mock request
      const request = {
        json: jest.fn().mockResolvedValue({ class: 'Math', value: 85 }),
      } as unknown as NextRequest;
      
      // Call the API handler
      const response = await POST(request);
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(201);
      expect(data).toEqual({ id: 1, class: 'Math', value: 85 });
      expect(gradesQueries.addGrade).toHaveBeenCalledWith('Math', 85);
    });

    it('handles invalid input', async () => {
      // Create a mock request with invalid input
      const request = {
        json: jest.fn().mockResolvedValue({ class: 'Math', value: 150 }), // Invalid grade value
      } as unknown as NextRequest;
      
      // Call the API handler
      const response = await POST(request);
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Grade must be between 0 and 100' });
      expect(gradesQueries.addGrade).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/grades', () => {
    it('returns all grades when no class is specified', async () => {
      // Mock the database response
      (gradesQueries.getAllGrades as jest.Mock).mockResolvedValue([
        { id: 1, class: 'Math', value: 85 },
        { id: 2, class: 'Science', value: 90 },
      ]);
      
      // Create a mock request with no search params
      const request = {
        url: 'http://localhost:3000/api/grades',
      } as unknown as NextRequest;
      
      // Call the API handler
      const response = await GET(request);
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(200);
      expect(data).toEqual([
        { id: 1, class: 'Math', value: 85 },
        { id: 2, class: 'Science', value: 90 },
      ]);
      expect(gradesQueries.getAllGrades).toHaveBeenCalled();
      expect(gradesQueries.getGradesByClass).not.toHaveBeenCalled();
    });

    it('returns grades filtered by class when class is specified', async () => {
      // Mock the database response
      (gradesQueries.getGradesByClass as jest.Mock).mockResolvedValue([
        { id: 1, class: 'Math', value: 85 },
        { id: 3, class: 'Math', value: 95 },
      ]);
      
      // Create a mock request with class search param
      const request = {
        url: 'http://localhost:3000/api/grades?class=Math',
      } as unknown as NextRequest;
      
      // Call the API handler
      const response = await GET(request);
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(200);
      expect(data).toEqual([
        { id: 1, class: 'Math', value: 85 },
        { id: 3, class: 'Math', value: 95 },
      ]);
      expect(gradesQueries.getGradesByClass).toHaveBeenCalledWith('Math');
      expect(gradesQueries.getAllGrades).not.toHaveBeenCalled();
    });

    it('handles database errors', async () => {
      // Mock the database error
      (gradesQueries.getAllGrades as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Create a mock request
      const request = {
        url: 'http://localhost:3000/api/grades',
      } as unknown as NextRequest;
      
      // Call the API handler
      const response = await GET(request);
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch grades' });
    });
  });
});