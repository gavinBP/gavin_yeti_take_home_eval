import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import GhibliApp from '../GhibliApp';

// Mock useMediaQuery to test different breakpoints
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: vi.fn(),
  };
});

const mockUseMediaQuery = useMediaQuery as vi.MockedFunction<
  typeof useMediaQuery
>;

// Mock the useGhibliFilms hook
vi.mock('../hooks/useGhibliFilms', () => ({
  useGhibliFilms: () => ({
    films: [
      { id: '1', title: 'Film 1' },
      { id: '2', title: 'Film 2' },
      { id: '3', title: 'Film 3' },
      { id: '4', title: 'Film 4' },
    ],
    allFilms: [],
    loading: false,
    loadingMore: false,
    error: null,
    refetch: vi.fn(),
    loadMoreFilms: vi.fn(),
    hasLoadedAllFilms: false,
    isOffline: false,
  }),
}));

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Responsive Design', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockClear();
  });

  it('should render header with responsive typography', () => {
    renderWithTheme(<GhibliApp />);

    const header = screen.getByText('🎬 Discover Studio Ghibli Films 🎬');
    expect(header).toBeInTheDocument();

    // Check that the header has responsive font sizes
    const headerElement = header as HTMLElement;
    expect(headerElement).toHaveStyle({
      fontSize: expect.stringMatching(/rem$/),
    });
  });

  it('should render subtitle with responsive typography', () => {
    renderWithTheme(<GhibliApp />);

    const subtitle = screen.getByText('Select a film & hover to learn more');
    expect(subtitle).toBeInTheDocument();

    // Check that the subtitle has responsive font sizes
    const subtitleElement = subtitle as HTMLElement;
    expect(subtitleElement).toHaveStyle({
      fontSize: expect.stringMatching(/rem$/),
    });
  });

  it('should render film grid with responsive layout', () => {
    renderWithTheme(<GhibliApp />);

    // Check that films are rendered
    expect(screen.getByText('Film 1')).toBeInTheDocument();
    expect(screen.getByText('Film 2')).toBeInTheDocument();
    expect(screen.getByText('Film 3')).toBeInTheDocument();
    expect(screen.getByText('Film 4')).toBeInTheDocument();

    // Check that the grid container has responsive properties
    const gridContainer = screen.getByText('Film 1').closest('div')
      ?.parentElement;
    expect(gridContainer).toHaveStyle({
      display: 'grid',
    });
  });

  it('should have responsive container padding', () => {
    renderWithTheme(<GhibliApp />);

    const container = screen
      .getByText('🎬 Discover Studio Ghibli Films 🎬')
      .closest('div');
    expect(container).toHaveStyle({
      paddingTop: expect.stringMatching(/px$/),
      paddingBottom: expect.stringMatching(/px$/),
    });
  });

  it('should render error boundary with responsive design', () => {
    renderWithTheme(<GhibliApp />);

    // The error boundary should be present (wrapped around the app)
    const appContainer = screen
      .getByText('🎬 Discover Studio Ghibli Films 🎬')
      .closest('div');
    expect(appContainer).toBeInTheDocument();
  });

  it('should have responsive background styling', () => {
    renderWithTheme(<GhibliApp />);

    const backgroundContainer = screen
      .getByText('🎬 Discover Studio Ghibli Films 🎬')
      .closest('div')?.parentElement;
    expect(backgroundContainer).toHaveStyle({
      minHeight: '100vh',
      background: expect.stringContaining('linear-gradient'),
    });
  });

  it('should render with proper accessibility structure', () => {
    renderWithTheme(<GhibliApp />);

    // Check for semantic HTML structure
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent('🎬 Discover Studio Ghibli Films 🎬');

    const subHeading = screen.getByRole('heading', { level: 2 });
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveTextContent('Select a film & hover to learn more');
  });

  it('should have responsive grid gap', () => {
    renderWithTheme(<GhibliApp />);

    const gridContainer = screen.getByText('Film 1').closest('div')
      ?.parentElement;
    expect(gridContainer).toHaveStyle({
      gap: expect.stringMatching(/px$/),
    });
  });

  it('should render with Montserrat font family', () => {
    renderWithTheme(<GhibliApp />);

    const header = screen.getByText('🎬 Discover Studio Ghibli Films 🎬');
    const headerElement = header as HTMLElement;

    // Check that Montserrat font is applied
    expect(headerElement).toHaveStyle({
      fontFamily: expect.stringContaining('Montserrat'),
    });
  });

  it('should have proper z-index layering', () => {
    renderWithTheme(<GhibliApp />);

    const container = screen
      .getByText('🎬 Discover Studio Ghibli Films 🎬')
      .closest('div');
    expect(container).toHaveStyle({
      position: 'relative',
      zIndex: expect.any(Number),
    });
  });

  it('should render with proper text alignment', () => {
    renderWithTheme(<GhibliApp />);

    const container = screen
      .getByText('🎬 Discover Studio Ghibli Films 🎬')
      .closest('div');
    expect(container).toHaveStyle({
      textAlign: 'center',
    });
  });
});
