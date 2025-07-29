import { useState, useMemo, useCallback } from 'react';
import type { Film, UseFilmPaginationReturn } from '../types/ghibli.types';

const FILMS_PER_PAGE = 4;

export const useFilmPagination = (films: Film[]): UseFilmPaginationReturn => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(films.length / FILMS_PER_PAGE);
  }, [films.length]);

  const currentFilms = useMemo(() => {
    const startIndex = (currentPage - 1) * FILMS_PER_PAGE;
    const endIndex = startIndex + FILMS_PER_PAGE;
    return films.slice(startIndex, endIndex);
  }, [films, currentPage]);

  const hasNext = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPrevious = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const goToNext = useCallback(() => {
    if (hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNext]);

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPrevious]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  // Reset to first page when films change
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentFilms,
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    goToNext,
    goToPrevious,
    goToPage,
    resetPagination,
  };
};
