import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import NumbersPage from '../app/numbers/page'
import { useRouter } from 'next/navigation'

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock fetch API
global.fetch = jest.fn()

describe('Numbers Page', () => {
  const mockRouter = {
    refresh: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/numbers/pairs') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id_1: 1, number_1: 5, id_2: 2, number_2: 10, sum: 15 },
            { id_1: 2, number_1: 10, id_2: 3, number_2: 15, sum: 25 },
          ]),
        })
      }
      if (url === '/api/numbers') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 3, value: 15 }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    })
  })

  it('renders the heading and form', () => {
    render(<NumbersPage />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Number Pair Calculations')
    expect(screen.getByPlaceholderText('Enter an integer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Adding...|Add Number/i })).toBeInTheDocument()
  })

  it('fetches and displays number pairs on load', async () => {
    await act(async () => {
      render(<NumbersPage />)
    })
    
    // Wait for the fetch to complete and table to render
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/numbers/pairs')
    })
    // Use getAllByText for duplicate numbers
    expect(screen.getAllByText('5').length).toBeGreaterThan(0)
    expect(screen.getAllByText('10').length).toBeGreaterThan(0)
    expect(screen.getAllByText('15').length).toBeGreaterThan(0)
    expect(screen.getAllByText('25').length).toBeGreaterThan(0)
  })

  it('submits a new number and refreshes the table', async () => {
    await act(async () => {
      render(<NumbersPage />)
    })
    
    await act(async () => {
      // Fill and submit the form
      const input = screen.getByPlaceholderText('Enter an integer')
      fireEvent.change(input, { target: { value: '20' } })
      const submitButton = screen.getByRole('button', { name: /Adding...|Add Number/i })
      fireEvent.click(submitButton)
    })

    // Check if the fetch was called with the right parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 20 }),
      })
      expect(mockRouter.refresh).toHaveBeenCalled()
      // Check if pairs were fetched again
      expect(global.fetch).toHaveBeenCalledWith('/api/numbers/pairs')
    })
  })

  it('handles fetch error gracefully', async () => {
    // Mock a failed fetch
    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
        status: 500,
      })
    })
    
    await act(async () => {
      render(<NumbersPage />)
    })

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch number pairs/i)).toBeInTheDocument()
    })
  })
})