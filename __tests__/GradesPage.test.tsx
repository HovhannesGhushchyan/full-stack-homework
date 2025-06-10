import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import GradesPage from '../app/grades/page'
import { useRouter } from 'next/navigation'

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock fetch API
global.fetch = jest.fn()

describe('Grades Page', () => {
  const mockRouter = {
    refresh: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/grades') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, class: 'Math', value: 85 },
            { id: 2, class: 'Science', value: 90 },
            { id: 3, class: 'History', value: 75 },
          ]),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 4, class: 'Math', value: 95 }),
      })
    })
  })

  it('renders the heading and form', async () => {
    await act(async () => {
      render(<GradesPage />)
    })
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Grade Management')
    expect(screen.getByLabelText(/Class/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Grade/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Adding...|Add Grade/i })).toBeInTheDocument()
  })

  it('fetches and displays grades on load', async () => {
    await act(async () => {
      render(<GradesPage />)
    })
    
    // Wait for the fetch to complete and table to render
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/grades')
    })

    // Check for table content
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    
    // Check for specific grade entries
    const mathGrade = screen.getByText('85')
    const scienceGrade = screen.getByText('90')
    const historyGrade = screen.getByText('75')
    
    expect(mathGrade).toBeInTheDocument()
    expect(scienceGrade).toBeInTheDocument()
    expect(historyGrade).toBeInTheDocument()
  })

  it('submits a new grade and refreshes the table', async () => {
    await act(async () => {
      render(<GradesPage />)
    })
    
    await act(async () => {
      const classSelect = screen.getByLabelText(/Class/i)
      const gradeInput = screen.getByLabelText(/Grade/i)
      
      fireEvent.change(classSelect, { target: { value: 'Science' } })
      fireEvent.change(gradeInput, { target: { value: '95' } })
      
      const submitButton = screen.getByRole('button', { name: /Adding...|Add Grade/i })
      fireEvent.click(submitButton)
    })
  
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ class: 'Science', value: 95 }),
      })
      expect(mockRouter.refresh).toHaveBeenCalled()
      expect(global.fetch).toHaveBeenCalledWith('/api/grades')
    })
  })
})