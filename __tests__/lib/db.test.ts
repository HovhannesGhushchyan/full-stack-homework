import { executeQuery, numbersQueries, gradesQueries } from '../../lib/db'

// Mock the pg Pool
jest.mock('pg', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  }
  
  const mockPool = {
    connect: jest.fn().mockResolvedValue(mockClient),
  }
  
  return { Pool: jest.fn(() => mockPool) }
})

describe('Database Queries', () => {
  let mockClient: { query: jest.Mock; release: jest.Mock };
  
  beforeEach(async () => { // Make beforeEach async
    jest.clearAllMocks();
    // Await the promise to get the actual mockClient
    mockClient = await require('pg').Pool().connect(); 
  });
  
  describe('executeQuery', () => {
    it('executes a query and returns the result', async () => {
      const mockResult = { rows: [{ id: 1, value: 42 }] }
      mockClient.query.mockResolvedValue(mockResult)
      
      const result = await executeQuery('SELECT * FROM test', [42])
      
      expect(mockClient.query).toHaveBeenCalledWith('SELECT * FROM test', [42])
      expect(mockClient.release).toHaveBeenCalled()
      expect(result).toEqual(mockResult)
    })
    
    it('releases the client even if the query fails', async () => {
      mockClient.query.mockRejectedValue(new Error('Query failed'))
      
      await expect(executeQuery('SELECT * FROM test')).rejects.toThrow('Query failed')
      expect(mockClient.release).toHaveBeenCalled()
    })
  })
  
  describe('numbersQueries', () => {
    describe('addNumber', () => {
      it('inserts a number and returns the result', async () => {
        const mockResult = { rows: [{ id: 1, value: 42 }] }
        mockClient.query.mockResolvedValue(mockResult)
        
        const result = await numbersQueries.addNumber(42)
        
        expect(mockClient.query).toHaveBeenCalledWith(
          'INSERT INTO "Number" (value) VALUES ($1) RETURNING *',
          [42]
        )
        expect(result).toEqual({ id: 1, value: 42 })
      })
    })
    
    describe('getAllNumbers', () => {
      it('returns all numbers', async () => {
        const mockResult = {
          rows: [
            { id: 1, value: 10 },
            { id: 2, value: 20 },
          ],
        }
        mockClient.query.mockResolvedValue(mockResult)
        
        const result = await numbersQueries.getAllNumbers()
        
        expect(mockClient.query).toHaveBeenCalledWith(
          'SELECT * FROM "Number" ORDER BY id ASC',
          []
        )
        expect(result).toEqual([
          { id: 1, value: 10 },
          { id: 2, value: 20 },
        ])
      })
    })
    
    describe('getAdjacentPairs', () => {
      it('returns adjacent number pairs with sums', async () => {
        const mockResult = {
          rows: [
            { id_1: 1, number_1: 10, id_2: 2, number_2: 20, sum: 30 },
            { id_1: 2, number_1: 20, id_2: 3, number_2: 30, sum: 50 },
          ],
        }
        mockClient.query.mockResolvedValue(mockResult)
        
        const result = await numbersQueries.getAdjacentPairs()
        
        expect(mockClient.query).toHaveBeenCalled()
        expect(result).toEqual([
          { id_1: 1, number_1: 10, id_2: 2, number_2: 20, sum: 30 },
          { id_1: 2, number_1: 20, id_2: 3, number_2: 30, sum: 50 },
        ])
      })
    })
  })
  
  describe('gradesQueries', () => {
    describe('addGrade', () => {
      it('inserts a grade and returns the result', async () => {
        const mockResult = { rows: [{ id: 1, class: 'Math', value: 85 }] }
        mockClient.query.mockResolvedValue(mockResult)
        
        const result = await gradesQueries.addGrade('Math', 85)
        
        expect(mockClient.query).toHaveBeenCalledWith(
          'INSERT INTO "Grade" (class, value) VALUES ($1, $2) RETURNING *',
          ['Math', 85]
        )
        expect(result).toEqual({ id: 1, class: 'Math', value: 85 })
      })
    })
    
    describe('getAllGrades', () => {
      it('returns all grades', async () => {
        const mockResult = {
          rows: [
            { id: 1, class: 'Math', value: 85 },
            { id: 2, class: 'Science', value: 90 },
          ],
        }
        mockClient.query.mockResolvedValue(mockResult)
        
        const result = await gradesQueries.getAllGrades()
        
        expect(mockClient.query).toHaveBeenCalledWith(
          'SELECT * FROM "Grade" ORDER BY id ASC',
          []
        )
        expect(result).toEqual([
          { id: 1, class: 'Math', value: 85 },
          { id: 2, class: 'Science', value: 90 },
        ])
      })
    })
    
    describe('getGradesByClass', () => {
      it('returns grades filtered by class', async () => {
        const mockResult = {
          rows: [
            { id: 1, class: 'Math', value: 85 },
            { id: 3, class: 'Math', value: 95 },
          ],
        }
        mockClient.query.mockResolvedValue(mockResult)
        
        const result = await gradesQueries.getGradesByClass('Math')
        
        expect(mockClient.query).toHaveBeenCalledWith(
          'SELECT * FROM "Grade" WHERE class = $1 ORDER BY id ASC',
          ['Math']
        )
        expect(result).toEqual([
          { id: 1, class: 'Math', value: 85 },
          { id: 3, class: 'Math', value: 95 },
        ])
      })
    })
  })
})