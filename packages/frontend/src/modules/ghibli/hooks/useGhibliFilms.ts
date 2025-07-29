import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { FILM_IDS } from '../constants/theme.constants';
import type { Film, UseGhibliFilmsReturn } from '../types/ghibli.types';

const GET_FILM_BY_ID = gql`
  query GetFilmById($id: String!) {
    film(id: $id) {
      id
      title
      description
      director
      releaseDate
      runtime
      image
      movieBanner
      rottenTomatoesScore
    }
  }
`;

const GET_MAIN_FILMS = gql`
  query GetMainFilms {
    films {
      id
      title
      description
      director
      releaseDate
      runtime
      image
      movieBanner
      rottenTomatoesScore
    }
  }
`;

export const useGhibliFilms = (): UseGhibliFilmsReturn => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create film objects for the main four films
  const mainFilms: Film[] = [
    { id: FILM_IDS.porcoRosso, title: 'Porco Rosso' },
    { id: FILM_IDS.kikiDelivery, title: "Kiki's Delivery Service" },
    { id: FILM_IDS.howlsCastle, title: "Howl's Moving Castle" },
    { id: FILM_IDS.totoro, title: 'My Neighbor Totoro' },
  ];

  const {
    data: filmsData,
    loading: filmsLoading,
    error: filmsError,
    refetch,
  } = useQuery(GET_MAIN_FILMS, {
    onCompleted: (data) => {
      if (data?.films && data.films.length > 0) {
        setFilms(data.films);
        setError(null);
      } else {
        // If no films returned, use the main films as fallback
        setFilms(mainFilms);
      }
    },
    onError: (error) => {
      console.error('GraphQL error:', error);
      // On error, use the main films as fallback
      setFilms(mainFilms);
      setError(error.message);
    },
  });

  useEffect(() => {
    setLoading(filmsLoading);
  }, [filmsLoading]);

  useEffect(() => {
    if (filmsError) {
      setError(filmsError.message);
    }
  }, [filmsError]);

  const refetchFilms = () => {
    refetch();
  };

  return {
    films: films.length > 0 ? films : mainFilms,
    loading,
    error,
    refetch: refetchFilms,
  };
};
