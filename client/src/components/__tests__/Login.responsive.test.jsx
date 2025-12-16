import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Login from '../Login'

// Mock the auth utilities
vi.mock('../../utils/auth', () => ({
  login: vi.fn(),
  redirectBasedOnRole: vi.fn()
}))

describe('Login Component - Responsive Behavior', () => {
  it('should render with responsive grid classes', () => {
    render(<Login />)
    
    // Check for responsive grid container
    const gridContainer = document.querySelector('.auth-grid')
    expect(gridContainer).toBeInTheDocument()
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-5')
  })

  it('should have touch-friendly form elements', () => {
    render(<Login />)
    
    // Check email input has touch-friendly classes
    const emailInput = screen.getByPlaceholderText('Enter your email')
    expect(emailInput).toHaveClass('touch-manipulation')
    
    // Check password input has touch-friendly classes
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    expect(passwordInput).toHaveClass('touch-manipulation')
    
    // Check submit button has minimum touch target size
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    expect(submitButton).toHaveClass('touch-manipulation', 'min-h-[48px]')
  })

  it('should have responsive typography classes', () => {
    render(<Login />)
    
    // Check main headline has responsive text sizing
    const headline = screen.getByText('Welcome Back to')
    expect(headline.parentElement).toHaveClass('text-3xl', 'sm:text-4xl', 'md:text-5xl', 'lg:text-6xl')
    
    // Check description has responsive text sizing
    const description = screen.getByText(/Continue your journey of effortless scheduling/i)
    expect(description).toHaveClass('text-base', 'sm:text-lg', 'md:text-xl')
  })

  it('should have proper mobile stacking order', () => {
    render(<Login />)
    
    // Check left panel has correct order classes
    const leftPanel = document.querySelector('.lg\\:col-span-2')
    expect(leftPanel).toHaveClass('order-1', 'lg:order-1')
    
    // Check right panel has correct order classes
    const rightPanel = document.querySelector('.lg\\:col-span-3')
    expect(rightPanel).toHaveClass('order-2', 'lg:order-2')
  })

  it('should have responsive spacing and padding', () => {
    render(<Login />)
    
    // Check container has responsive padding
    const container = document.querySelector('.max-w-7xl')
    expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8', 'py-8', 'sm:py-12', 'lg:py-20')
    
    // Check form container has responsive padding
    const formContainer = document.querySelector('.bg-white\\/90')
    expect(formContainer).toHaveClass('p-6', 'sm:p-8')
  })

  it('should have accessibility features for mobile', () => {
    render(<Login />)
    
    // Check password toggle button has proper accessibility
    const passwordToggle = screen.getByLabelText(/show password|hide password/i)
    expect(passwordToggle).toHaveClass('touch-manipulation', 'min-w-[44px]', 'min-h-[44px]')
    
    // Check form inputs have proper base font size for mobile
    const emailInput = screen.getByPlaceholderText('Enter your email')
    expect(emailInput).toHaveClass('text-base')
  })
})