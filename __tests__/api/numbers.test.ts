import { NextRequest } from 'next/server';
import { POST, GET } from '../../app/api/numbers/route';
import { numbersQueries } from '../../lib/db';

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
  numbersQueries: {
    addNumber: jest.fn(),
    getAllNumbers: jest.fn(),
  },
}));

describe('Numbers API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/numbers', () => {
    it('adds a number successfully', async () => {
      // Mock the database response
      (numbersQueries.addNumber as jest.Mock).mockResolvedValue({ id: 1, value: 42 });
      
      // Create a mock request
      const request = {
        json: jest.fn().mockResolvedValue({ value: 42 }),
      } as unknown as NextRequest;
      
      // Call the API handler
      const response = await POST(request);
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(201);
      expect(data).toEqual({ id: 1, value: 42 });
      expect(numbersQueries.addNumber).toHaveBeenCalledWith(42);
    });

    it('handles invalid input', async () => {
      // Create a mock request with invalid input
      const request = {
        json: jest.fn().mockResolvedValue({ value: 'not a number' }),
      } as unknown as NextRequest;
      
      // Call the API handler
      const response = await POST(request);
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Value must be a number' });
      expect(numbersQueries.addNumber).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/numbers', () => {
    it('returns all numbers', async () => {
      // Mock the database response
      (numbersQueries.getAllNumbers as jest.Mock).mockResolvedValue([
        { id: 1, value: 42 },
        { id: 2, value: 24 },
      ]);
      
      // Create a mock request
      const request = {} as NextRequest;
      
      // Call the API handler
      const response = await GET();
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(200);
      expect(data).toEqual([
        { id: 1, value: 42 },
        { id: 2, value: 24 },
      ]);
      expect(numbersQueries.getAllNumbers).toHaveBeenCalled();
    });

    it('handles database errors', async () => {
      // Mock the database error
      (numbersQueries.getAllNumbers as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Create a mock request
      const request = {} as NextRequest;
      
      // Call the API handler
      const response = await GET();
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch numbers' });
    });
  });
}); 