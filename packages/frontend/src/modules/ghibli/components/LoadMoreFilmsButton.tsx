import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

interface LoadMoreFilmsButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  hasMoreFilms?: boolean;
  totalFilms?: number;
  loadedFilms?: number;
}

const LoadMoreFilmsButton: React.FC<LoadMoreFilmsButtonProps> = ({
  onClick,
  isLoading = false,
  hasMoreFilms = true,
  totalFilms = 0,
  loadedFilms = 0,
}) => {
  if (!hasMoreFilms) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          marginTop: 3,
          padding: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          🎬 All {totalFilms} Studio Ghibli films have been loaded!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        marginTop: 3,
        padding: 2,
      }}
    >
      <Button
        variant="outlined"
        onClick={onClick}
        disabled={isLoading}
        startIcon={<ExpandMore />}
        sx={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          fontSize: { xs: '0.9rem', sm: '1rem' },
          padding: { xs: '10px 20px', sm: '12px 24px' },
          borderColor: '#1976d2',
          color: '#1976d2',
          borderWidth: '2px',
          borderRadius: '25px',
          textTransform: 'none',
          '&:hover': {
            borderColor: '#1565c0',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            borderWidth: '2px',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          '&:disabled': {
            borderColor: 'rgba(0, 0, 0, 0.2)',
            color: 'rgba(0, 0, 0, 0.3)',
          },
          transition: 'all 0.2s ease-in-out',
          minWidth: { xs: '200px', sm: '220px' },
        }}
      >
        {isLoading ? 'Loading...' : 'Load More Films'}
      </Button>

      {totalFilms > 0 && (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            textAlign: 'center',
          }}
        >
          Showing {loadedFilms} of {totalFilms} films
        </Typography>
      )}
    </Box>
  );
};

export default LoadMoreFilmsButton;
