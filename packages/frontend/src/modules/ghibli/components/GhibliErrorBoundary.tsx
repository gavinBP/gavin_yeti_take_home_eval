import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class GhibliErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('GhibliApp ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 3,
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              padding: 4,
              maxWidth: 600,
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                color: '#d32f2f',
                marginBottom: 2,
              }}
            >
              🎬 Studio Ghibli Films
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                color: '#d32f2f',
                marginBottom: 3,
              }}
            >
              Something went wrong
            </Typography>

            <Alert severity="error" sx={{ marginBottom: 3 }}>
              <Typography
                variant="body1"
                sx={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                We encountered an error while loading the Studio Ghibli films.
              </Typography>
            </Alert>

            <Typography
              variant="body2"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                color: 'rgba(0, 0, 0, 0.7)',
                marginBottom: 4,
                lineHeight: 1.6,
              }}
            >
              Don&apos;t worry! This is likely a temporary issue. You can try
              again to reload the films, or refresh the page if the problem
              persists.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={this.handleRetry}
                sx={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  backgroundColor: '#1976d2',
                  padding: '12px 24px',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => window.location.reload()}
                sx={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  padding: '12px 24px',
                  '&:hover': {
                    borderColor: '#1565c0',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                Refresh Page
              </Button>
            </Box>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ marginTop: 4, textAlign: 'left' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                    color: '#d32f2f',
                    marginBottom: 2,
                  }}
                >
                  Error Details (Development):
                </Typography>
                <Box
                  sx={{
                    backgroundColor: '#f5f5f5',
                    padding: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    overflow: 'auto',
                    maxHeight: 200,
                    border: '1px solid #ddd',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: '#d32f2f', marginBottom: 1 }}
                  >
                    {this.state.error.toString()}
                  </Typography>
                  {this.state.errorInfo && (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default GhibliErrorBoundary;
