import React, { useState } from 'react';
import { Box, Typography, Container, Alert } from '@mui/material';
import FilmButton from './components/FilmButton';
import FilmCard from './components/FilmCard';
import { useGhibliFilms } from './hooks/useGhibliFilms';
import type { Film } from './types/ghibli.types';

interface GhibliAppProps {
  // Props will be added as we implement more features
}

const GhibliApp: React.FC<GhibliAppProps> = () => {
  const { films, loading, error } = useGhibliFilms();
  const [selectedFilms, setSelectedFilms] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const handleFilmClick = (filmId: string) => {
    setSelectedFilms((prev) => new Set(prev).add(filmId));
  };

  const handleCardToggle = (filmId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(filmId)) {
        newSet.delete(filmId);
      } else {
        newSet.add(filmId);
      }
      return newSet;
    });
  };

  const renderFilmComponent = (film: Film) => {
    const isSelected = selectedFilms.has(film.id);
    const isExpanded = expandedCards.has(film.id);

    if (isSelected) {
      return (
        <FilmCard
          key={film.id}
          film={film}
          isExpanded={isExpanded}
          onToggle={() => handleCardToggle(film.id)}
        />
      );
    }

    return (
      <FilmButton
        key={film.id}
        film={film}
        onClick={() => handleFilmClick(film.id)}
        isLoading={loading}
      />
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)',
        backgroundImage: 'url("/cloud_background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          paddingTop: 4,
          paddingBottom: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 700,
            color: '#000000',
            marginBottom: 2,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          🎬 Discover Studio Ghibli Films 🎬
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
            fontWeight: 400,
            color: '#000000',
            marginBottom: 6,
            opacity: 0.8,
          }}
        >
          Select a film & hover to learn more
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fit, minmax(290px, 1fr))',
            },
            gap: { xs: 2, sm: 3 },
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 2,
          }}
        >
          {films.map(renderFilmComponent)}
        </Box>

        {selectedFilms.size > 0 && (
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Typography
              variant="button"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                color: '#000000',
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': {
                  opacity: 0.7,
                },
              }}
              onClick={() => {
                setSelectedFilms(new Set());
                setExpandedCards(new Set());
              }}
            >
              ← Back to Film Selection
            </Typography>
          </Box>
        )}

        {/* Test message to verify component is loading */}
        <Typography
          sx={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 255, 0, 0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 1000,
          }}
        >
          ✅ GhibliApp Loaded!
        </Typography>
      </Container>
    </Box>
  );
};

export default GhibliApp;
