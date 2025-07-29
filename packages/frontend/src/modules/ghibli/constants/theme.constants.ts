// Color palette
export const COLORS = {
  primary: '#000000',
  secondary: '#004915', // Rotten Tomatoes green
  background: {
    card: 'rgba(255, 255, 255, 0.9)',
    cardHover: 'rgba(255, 255, 255, 0.95)',
    cardDisabled: 'rgba(255, 255, 255, 0.7)',
    fallback: '#000000',
  },
  text: {
    primary: '#000000',
    secondary: '#004915',
    disabled: 'rgba(0, 0, 0, 0.5)',
    fallback: '#ffffff',
  },
  shadow: {
    default: '0 4px 8px rgba(0, 0, 0, 0.1)',
    hover: '0 6px 12px rgba(0, 0, 0, 0.15)',
    active: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: 'Montserrat, sans-serif',
  sizes: {
    header: {
      xs: '1.5rem',
      sm: '2rem',
      md: '2.5rem',
    },
    subtitle: {
      xs: '0.9rem',
      sm: '1rem',
      md: '1.2rem',
    },
    button: '1.1rem',
    cardTitle: '1.1rem',
    description: '14px',
    details: '11px',
    rottenTomatoes: '42.5px',
    fallback: '1rem',
  },
  weights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
  lineHeights: {
    description: 1.43,
    rottenTomatoes: 1.43,
  },
} as const;

// Spacing
export const SPACING = {
  card: {
    width: '290.5px',
    height: '368px',
    borderRadius: '8px',
    padding: '16px',
  },
  margins: {
    description: '22px 22.5px 13px 21px',
    details: '13px 22.5px 28px 21px',
    rottenTomatoes: '0 0 0 12px',
    buttonSpinner: '8px',
  },
  dimensions: {
    description: {
      width: '247px',
      height: '80px',
    },
    details: {
      width: '247px',
      height: '39px',
    },
    rottenTomatoes: {
      width: '90px',
      height: '61px',
    },
  },
} as const;

// Transitions
export const TRANSITIONS = {
  default: 'all 0.3s ease-in-out',
  transform: {
    hover: 'translateY(-2px)',
    active: 'translateY(0px)',
    mobileActive: 'scale(0.98)',
  },
} as const;

// Breakpoints
export const BREAKPOINTS = {
  mobile: '768px',
} as const;

// Film data
export const FILM_IDS = {
  porcoRosso: 'ebbb6b7c-945c-41ee-a792-de0e43191bd8',
  kikiDelivery: 'ea660b10-85c4-4ae3-8a5f-41cea3648e3e',
  howlsCastle: 'cd3d059c-09f4-4ff3-8d63-bc765a5184fa',
  totoro: '58611129-2dbc-4a81-a72f-77ddfc1b1b49',
} as const;

export const FILM_TITLES = {
  porcoRosso: 'Porco Rosso',
  kikiDelivery: "Kiki's Delivery Service",
  howlsCastle: "Howl's Moving Castle",
  totoro: 'My Neighbor Totoro',
} as const;

// Fallback text
export const FALLBACK_TEXT = {
  rottenTomatoes: 'Not Available',
  image: 'Image Not Available',
  description: 'Description not available',
  director: 'Director not available',
  releaseDate: 'Release date not available',
  runtime: 'Runtime not available',
} as const;
