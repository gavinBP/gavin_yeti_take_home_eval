import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GhibliErrorBoundary from './GhibliErrorBoundary';

// Mock console.error to avoid noise in tests
const mockConsoleError = vi
  .spyOn(console, 'error')
  .mockImplementation(() => {});

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal content</div>;
};

describe('GhibliErrorBoundary', () => {
  beforeEach(() => {
    mockConsoleError.mockClear();
  });

  it('should render children when there is no error', () => {
    render(
      <GhibliErrorBoundary>
        <div>Test content</div>
      </GhibliErrorBoundary>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render error UI when child throws an error', () => {
    render(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GhibliErrorBoundary>,
    );

    // Check that error UI is displayed
    expect(screen.getByText('🎬 Studio Ghibli Films')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an error/)).toBeInTheDocument();
    expect(screen.getByText(/Don't worry/)).toBeInTheDocument();
  });

  it('should display Try Again and Refresh Page buttons', () => {
    render(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GhibliErrorBoundary>,
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
  });

  it('should log error to console', () => {
    render(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GhibliErrorBoundary>,
    );

    expect(mockConsoleError).toHaveBeenCalledWith(
      'GhibliApp ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object),
    );
  });

  it('should recover from error when Try Again is clicked', () => {
    const { rerender } = render(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GhibliErrorBoundary>,
    );

    // Error UI should be displayed
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click Try Again
    fireEvent.click(screen.getByText('Try Again'));

    // Re-render with no error
    rerender(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={false} />
      </GhibliErrorBoundary>,
    );

    // Should show normal content
    expect(screen.getByText('Normal content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('should reload page when Refresh Page is clicked', () => {
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GhibliErrorBoundary>,
    );

    fireEvent.click(screen.getByText('Refresh Page'));
    expect(mockReload).toHaveBeenCalled();
  });

  it('should show development error details in development mode', () => {
    // Mock NODE_ENV to be development
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GhibliErrorBoundary>,
    );

    expect(
      screen.getByText('Error Details (Development):'),
    ).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    // Restore original env
    process.env.NODE_ENV = originalEnv;
  });

  it('should not show development error details in production mode', () => {
    // Mock NODE_ENV to be production
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GhibliErrorBoundary>,
    );

    expect(
      screen.queryByText('Error Details (Development):'),
    ).not.toBeInTheDocument();

    // Restore original env
    process.env.NODE_ENV = originalEnv;
  });

  it('should have proper styling classes and structure', () => {
    render(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GhibliErrorBoundary>,
    );

    // Check that the error boundary has the expected structure
    const errorContainer = screen
      .getByText('🎬 Studio Ghibli Films')
      .closest('div');
    expect(errorContainer).toHaveStyle({
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });

  it('should handle multiple errors gracefully', () => {
    const { rerender } = render(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GhibliErrorBoundary>,
    );

    // First error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Try to recover
    fireEvent.click(screen.getByText('Try Again'));

    // Re-render with another error
    rerender(
      <GhibliErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GhibliErrorBoundary>,
    );

    // Should still show error UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
