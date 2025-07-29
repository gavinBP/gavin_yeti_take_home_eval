import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PaginationControls from './PaginationControls';

describe('PaginationControls', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    hasPrevious: false,
    hasNext: true,
  };

  it('should render pagination controls with correct page information', () => {
    render(<PaginationControls {...defaultProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('of')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should call onPrevious when previous button is clicked', () => {
    const onPrevious = vi.fn();
    render(
      <PaginationControls
        {...defaultProps}
        hasPrevious={true}
        onPrevious={onPrevious}
      />,
    );

    const previousButton = screen.getByLabelText('Previous page');
    fireEvent.click(previousButton);

    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onNext when next button is clicked', () => {
    const onNext = vi.fn();
    render(
      <PaginationControls {...defaultProps} hasNext={true} onNext={onNext} />,
    );

    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);

    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('should disable previous button when hasPrevious is false', () => {
    render(<PaginationControls {...defaultProps} hasPrevious={false} />);

    const previousButton = screen.getByLabelText('Previous page');
    expect(previousButton).toBeDisabled();
  });

  it('should disable next button when hasNext is false', () => {
    render(<PaginationControls {...defaultProps} hasNext={false} />);

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('should show correct page numbers', () => {
    render(
      <PaginationControls {...defaultProps} currentPage={3} totalPages={10} />,
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should handle single page correctly', () => {
    render(
      <PaginationControls
        {...defaultProps}
        currentPage={1}
        totalPages={1}
        hasNext={false}
      />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // total pages
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('should have proper accessibility attributes', () => {
    render(<PaginationControls {...defaultProps} />);

    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <PaginationControls
        {...defaultProps}
        hasPrevious={true}
        hasNext={true}
        onPrevious={onPrevious}
        onNext={onNext}
      />,
    );

    const previousButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');

    // Test Enter key
    fireEvent.keyDown(previousButton, { key: 'Enter' });
    expect(onPrevious).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(nextButton, { key: 'Enter' });
    expect(onNext).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(previousButton, { key: ' ' });
    expect(onPrevious).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(nextButton, { key: ' ' });
    expect(onNext).toHaveBeenCalledTimes(2);
  });

  it('should not call handlers when buttons are disabled', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <PaginationControls
        {...defaultProps}
        hasPrevious={false}
        hasNext={false}
        onPrevious={onPrevious}
        onNext={onNext}
      />,
    );

    const previousButton = screen.getByLabelText('Previous page');
    const nextButton = screen.getByLabelText('Next page');

    fireEvent.click(previousButton);
    fireEvent.click(nextButton);

    expect(onPrevious).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });

  it('should render with proper styling classes', () => {
    render(<PaginationControls {...defaultProps} />);

    const container = screen.getByText('1').closest('div');
    expect(container).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });
});
