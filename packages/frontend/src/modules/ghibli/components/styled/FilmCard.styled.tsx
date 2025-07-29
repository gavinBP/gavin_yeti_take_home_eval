import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const FilmCardContainer = styled(Box)(() => ({
  width: '290.5px',
  height: '368px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',

  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },

  // Mobile touch feedback
  '@media (max-width: 768px)': {
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
}));

export const InfoPopup = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '70%',
  backgroundColor: '#ffffff',
  padding: '0',
  borderRadius: '8px 8px 0 0',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)',
}));

export const CardImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
}));

export const CardTitle = styled(Typography)(() => ({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '1.1rem',
  fontWeight: 500,
  color: '#000000',
  textAlign: 'center',
  margin: 0,
}));

export const CardDescription = styled(Typography)(() => ({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '14px',
  fontWeight: 'normal',
  lineHeight: 1.43,
  color: '#000000',
  margin: '22px 22.5px 13px 21px',
  width: '247px',
  height: '80px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
}));

export const CardDetails = styled(Typography)(() => ({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '11px',
  fontWeight: 'bold',
  fontStyle: 'italic',
  color: '#000000',
  margin: '13px 22.5px 28px 21px',
  width: '247px',
  height: '39px',
}));

export const RottenTomatoesScore = styled(Typography)(() => ({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '42.5px',
  fontWeight: 500,
  lineHeight: 1.43,
  color: '#004915',
  margin: '0 0 0 12px',
  width: '90px',
  height: '61px',
}));

export const ImageFallback = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#000000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
}));

export const FallbackText = styled(Typography)(() => ({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '1rem',
  fontWeight: 500,
  color: '#ffffff',
  textAlign: 'center',
}));

export const HoverOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  zIndex: 2,
}));

export const ArrowIcon = styled(Box)(() => ({
  position: 'absolute',
  bottom: '16px',
  right: '16px',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#000000',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
}));
