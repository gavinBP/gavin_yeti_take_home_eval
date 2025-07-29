// GraphQL query types for Studio Ghibli films
export interface Film {
  id: string;
  title: string;
  description?: string | null;
  director?: string | null;
  releaseDate?: string | null;
  runtime?: string | null;
  image?: string | null;
  movieBanner?: string | null;
  rottenTomatoesScore?: string | null;
}

// GraphQL query responses
export interface FilmsQueryResponse {
  films: Film[];
}

export interface FilmQueryResponse {
  film: Film | null;
}

export interface AllFilmsQueryResponse {
  allFilms: Film[];
}

// GraphQL query variables
export interface FilmQueryVariables {
  id: string;
}

// Component props interfaces
export interface FilmCardProps {
  film: Film;
  isExpanded: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  hoverColor?: string;
}

export interface FilmButtonProps {
  film: Film;
  onClick: () => void;
  isLoading?: boolean;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Custom hook return types
export interface UseGhibliFilmsReturn {
  films: Film[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isOffline: boolean;
}

export interface UseFilmPaginationReturn {
  currentFilms: Film[];
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  goToPage: (page: number) => void;
}

// Utility types
export type FilmCardState = 'default' | 'hover' | 'expanded';

export interface ImageFallbackConfig {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  fontSize: string;
}

// Error types
export interface GhibliError {
  message: string;
  code?: string;
  details?: unknown;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}
