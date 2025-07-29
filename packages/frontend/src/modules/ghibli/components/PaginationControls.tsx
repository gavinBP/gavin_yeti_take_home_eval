import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import type { PaginationControlsProps } from '../types/ghibli.types';

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 1, sm: 2 },
        marginTop: { xs: 2, sm: 3 },
        padding: { xs: 1, sm: 2 },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        margin: '0 auto',
        marginTop: { xs: 2, sm: 3 },
      }}
    >
      <IconButton
        onClick={onPrevious}
        disabled={!hasPrevious}
        sx={{
          backgroundColor: hasPrevious
            ? 'rgba(25, 118, 210, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
          color: hasPrevious ? '#1976d2' : 'rgba(0, 0, 0, 0.3)',
          '&:hover': {
            backgroundColor: hasPrevious
              ? 'rgba(25, 118, 210, 0.2)'
              : 'rgba(0, 0, 0, 0.05)',
            transform: hasPrevious ? 'scale(1.05)' : 'scale(1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: { xs: '40px', sm: '48px' },
          height: { xs: '40px', sm: '48px' },
        }}
        aria-label="Previous page"
      >
        <ChevronLeft sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: '80px',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            color: '#000000',
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          {currentPage}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          of
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
            color: '#000000',
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          {totalPages}
        </Typography>
      </Box>

      <IconButton
        onClick={onNext}
        disabled={!hasNext}
        sx={{
          backgroundColor: hasNext
            ? 'rgba(25, 118, 210, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
          color: hasNext ? '#1976d2' : 'rgba(0, 0, 0, 0.3)',
          '&:hover': {
            backgroundColor: hasNext
              ? 'rgba(25, 118, 210, 0.2)'
              : 'rgba(0, 0, 0, 0.05)',
            transform: hasNext ? 'scale(1.05)' : 'scale(1)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: { xs: '40px', sm: '48px' },
          height: { xs: '40px', sm: '48px' },
        }}
        aria-label="Next page"
      >
        <ChevronRight sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
      </IconButton>
    </Box>
  );
};

export default PaginationControls;
