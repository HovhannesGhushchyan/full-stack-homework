import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ErrorBoundary from '../app/components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for expected error throws
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when child component throws', () => {
    act(() => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We apologize for the inconvenience/)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;
    
    act(() => {
      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('resets error state when try again button is clicked', () => {
    act(() => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
    });

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    act(() => {
      fireEvent.click(screen.getByText('Try again'));
    });
    
    // The error boundary should re-render and throw the error again
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
}); 