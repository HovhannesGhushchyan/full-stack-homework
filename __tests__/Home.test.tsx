import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1, name: /Full Stack Assessment/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders the Numbers card with link', () => {
    render(<Home />)
    const numbersHeading = screen.getByRole('heading', { level: 2, name: /Numbers/i })
    const numbersLink = screen.getByRole('link', { name: /Go to Numbers/i })
    
    expect(numbersHeading).toBeInTheDocument()
    expect(numbersLink).toBeInTheDocument()
    expect(numbersLink).toHaveAttribute('href', '/numbers')
  })

  it('renders the Grades card with link', () => {
    render(<Home />)
    const gradesHeading = screen.getByRole('heading', { level: 2, name: /Grades/i })
    const gradesLink = screen.getByRole('link', { name: /Go to Grades/i })
    
    expect(gradesHeading).toBeInTheDocument()
    expect(gradesLink).toBeInTheDocument()
    expect(gradesLink).toHaveAttribute('href', '/grades')
  })
})