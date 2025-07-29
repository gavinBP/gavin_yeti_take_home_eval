import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoadMoreFilmsButton from './LoadMoreFilmsButton';

describe('LoadMoreFilmsButton', () => {
  const defaultProps = {
    onClick: vi.fn(),
    isLoading: false,
    hasMoreFilms: true,
    totalFilms: 20,
    loadedFilms: 4,
  };

  it('should render load more button when there are more films', () => {
    render(<LoadMoreFilmsButton {...defaultProps} />);

    expect(screen.getByText('Load More Films')).toBeInTheDocument();
    expect(screen.getByText('Showing 4 of 20 films')).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', () => {
    const onClick = vi.fn();
    render(<LoadMoreFilmsButton {...defaultProps} onClick={onClick} />);

    const button = screen.getByText('Load More Films');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should show loading state when isLoading is true', () => {
    render(<LoadMoreFilmsButton {...defaultProps} isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show completion message when hasMoreFilms is false', () => {
    render(
      <LoadMoreFilmsButton
        {...defaultProps}
        hasMoreFilms={false}
        totalFilms={15}
      />,
    );

    expect(
      screen.getByText('🎬 All 15 Studio Ghibli films have been loaded!'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Load More Films')).not.toBeInTheDocument();
  });

  it('should not show film count when totalFilms is 0', () => {
    render(<LoadMoreFilmsButton {...defaultProps} totalFilms={0} />);

    expect(screen.queryByText(/Showing.*of.*films/)).not.toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    const onClick = vi.fn();
    render(<LoadMoreFilmsButton {...defaultProps} onClick={onClick} />);

    const button = screen.getByText('Load More Films');

    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);

    // Test Space key
    fireEvent.keyDown(button, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('should not call onClick when button is disabled', () => {
    const onClick = vi.fn();
    render(
      <LoadMoreFilmsButton
        {...defaultProps}
        onClick={onClick}
        isLoading={true}
      />,
    );

    const button = screen.getByText('Loading...');
    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    render(<LoadMoreFilmsButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('should handle edge case with no films loaded', () => {
    render(
      <LoadMoreFilmsButton {...defaultProps} loadedFilms={0} totalFilms={10} />,
    );

    expect(screen.getByText('Showing 0 of 10 films')).toBeInTheDocument();
  });

  it('should handle large numbers correctly', () => {
    render(
      <LoadMoreFilmsButton
        {...defaultProps}
        loadedFilms={100}
        totalFilms={1000}
      />,
    );

    expect(screen.getByText('Showing 100 of 1000 films')).toBeInTheDocument();
  });

  it('should render with proper styling structure', () => {
    render(<LoadMoreFilmsButton {...defaultProps} />);

    const container = screen.getByText('Load More Films').closest('div');
    expect(container).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    });
  });
});
