import '@testing-library/jest-dom'

// Mock Next.js server objects
global.Request = jest.fn() as any;
global.Response = jest.fn() as any;

// Mock NextResponse
global.NextResponse = {
  json: jest.fn().mockImplementation(data => ({
    json: () => Promise.resolve(data),
    status: 200,
    ok: true,
  }))
} as any;