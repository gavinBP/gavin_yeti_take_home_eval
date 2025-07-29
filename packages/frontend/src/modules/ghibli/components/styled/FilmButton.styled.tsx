import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';

export const FilmButtonContainer = styled(Button)(() => ({
  width: '290.5px',
  height: '368px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '1.1rem',
  fontWeight: 500,
  color: '#000000',
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  border: '2px solid transparent',
  position: 'relative',
  overflow: 'hidden',

  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
    border: '2px solid rgba(0, 0, 0, 0.1)',
  },

  '&:active': {
    transform: 'translateY(0px)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },

  '&:disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    color: 'rgba(0, 0, 0, 0.5)',
    cursor: 'not-allowed',
    transform: 'none',
  },

  // Mobile touch feedback
  '@media (max-width: 768px)': {
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      transform: 'scale(0.98)',
    },
  },
}));

export const LoadingSpinner = styled(CircularProgress)(() => ({
  color: '#000000',
  marginRight: '8px',
}));

export const ButtonContent = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
});

export const FilmImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
}));

export const ImageFallback = styled('div')(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#000000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
}));

export const FallbackText = styled('div')(() => ({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '1rem',
  fontWeight: 500,
  color: '#ffffff',
  textAlign: 'center',
}));
