import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilmPagination } from './useFilmPagination';
import type { Film } from '../types/ghibli.types';

const mockFilms: Film[] = [
  { id: '1', title: 'Film 1' },
  { id: '2', title: 'Film 2' },
  { id: '3', title: 'Film 3' },
  { id: '4', title: 'Film 4' },
  { id: '5', title: 'Film 5' },
  { id: '6', title: 'Film 6' },
  { id: '7', title: 'Film 7' },
  { id: '8', title: 'Film 8' },
  { id: '9', title: 'Film 9' },
  { id: '10', title: 'Film 10' },
];

describe('useFilmPagination', () => {
  it('should initialize with first page and correct total pages', () => {
    const { result } = renderHook(() => useFilmPagination(mockFilms));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3); // 10 films / 4 per page = 3 pages
    expect(result.current.currentFilms).toHaveLength(4);
    expect(result.current.currentFilms[0].title).toBe('Film 1');
    expect(result.current.hasPrevious).toBe(false);
    expect(result.current.hasNext).toBe(true);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => useFilmPagination(mockFilms));

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentFilms).toHaveLength(4);
    expect(result.current.currentFilms[0].title).toBe('Film 5');
    expect(result.current.hasPrevious).toBe(true);
    expect(result.current.hasNext).toBe(true);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => useFilmPagination(mockFilms));

    // Go to page 2 first
    act(() => {
      result.current.goToNext();
    });

    // Then go back to page 1
    act(() => {
      result.current.goToPrevious();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentFilms[0].title).toBe('Film 1');
    expect(result.current.hasPrevious).toBe(false);
    expect(result.current.hasNext).toBe(true);
  });

  it('should go to specific page', () => {
    const { result } = renderHook(() => useFilmPagination(mockFilms));

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.currentFilms).toHaveLength(2); // Last 2 films
    expect(result.current.currentFilms[0].title).toBe('Film 9');
    expect(result.current.hasPrevious).toBe(true);
    expect(result.current.hasNext).toBe(false);
  });

  it('should handle edge cases for page navigation', () => {
    const { result } = renderHook(() => useFilmPagination(mockFilms));

    // Try to go to page 0 (invalid)
    act(() => {
      result.current.goToPage(0);
    });

    expect(result.current.currentPage).toBe(1); // Should stay on page 1

    // Try to go to page beyond total pages
    act(() => {
      result.current.goToPage(10);
    });

    expect(result.current.currentPage).toBe(1); // Should stay on page 1
  });

  it('should handle empty films array', () => {
    const { result } = renderHook(() => useFilmPagination([]));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.currentFilms).toHaveLength(0);
    expect(result.current.hasPrevious).toBe(false);
    expect(result.current.hasNext).toBe(false);
  });

  it('should handle films array with less than 4 films', () => {
    const smallFilms = mockFilms.slice(0, 3);
    const { result } = renderHook(() => useFilmPagination(smallFilms));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.currentFilms).toHaveLength(3);
    expect(result.current.hasPrevious).toBe(false);
    expect(result.current.hasNext).toBe(false);
  });

  it('should handle exactly 4 films', () => {
    const fourFilms = mockFilms.slice(0, 4);
    const { result } = renderHook(() => useFilmPagination(fourFilms));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.currentFilms).toHaveLength(4);
    expect(result.current.hasPrevious).toBe(false);
    expect(result.current.hasNext).toBe(false);
  });

  it('should reset pagination', () => {
    const { result } = renderHook(() => useFilmPagination(mockFilms));

    // Go to page 3
    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);

    // Reset pagination
    act(() => {
      result.current.resetPagination();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentFilms[0].title).toBe('Film 1');
  });

  it('should handle films array changes', () => {
    const { result, rerender } = renderHook(
      ({ films }) => useFilmPagination(films),
      { initialProps: { films: mockFilms } },
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);

    // Change films array
    const newFilms = mockFilms.slice(0, 6);
    rerender({ films: newFilms });

    expect(result.current.currentPage).toBe(1); // Should reset to page 1
    expect(result.current.totalPages).toBe(2); // 6 films / 4 per page = 2 pages
    expect(result.current.currentFilms).toHaveLength(4);
  });

  it('should not allow navigation beyond boundaries', () => {
    const { result } = renderHook(() => useFilmPagination(mockFilms));

    // Try to go to previous page when on first page
    act(() => {
      result.current.goToPrevious();
    });

    expect(result.current.currentPage).toBe(1); // Should stay on page 1

    // Go to last page
    act(() => {
      result.current.goToPage(3);
    });

    // Try to go to next page when on last page
    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentPage).toBe(3); // Should stay on page 3
  });

  it('should calculate correct page ranges', () => {
    const { result } = renderHook(() => useFilmPagination(mockFilms));

    // Page 1: films 1-4
    expect(result.current.currentFilms.map((f) => f.title)).toEqual([
      'Film 1',
      'Film 2',
      'Film 3',
      'Film 4',
    ]);

    // Go to page 2
    act(() => {
      result.current.goToNext();
    });

    // Page 2: films 5-8
    expect(result.current.currentFilms.map((f) => f.title)).toEqual([
      'Film 5',
      'Film 6',
      'Film 7',
      'Film 8',
    ]);

    // Go to page 3
    act(() => {
      result.current.goToNext();
    });

    // Page 3: films 9-10
    expect(result.current.currentFilms.map((f) => f.title)).toEqual([
      'Film 9',
      'Film 10',
    ]);
  });
});
