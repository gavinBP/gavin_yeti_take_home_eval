import { HttpService } from '../Http/Http.service';
import { CacheService } from '../Cache/Cache.service';
import { RetryService } from '../Retry/Retry.service';

export interface GhibliFilm {
  id: string;
  title: string;
  description: string;
  director: string;
  release_date: string;
  running_time: string;
  image: string;
  movie_banner: string;
  rt_score?: string;
}

export class GhibliAPIService {
  private httpService: HttpService;
  private cacheService: CacheService;
  private retryService: RetryService;
  private baseUrl: string;
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  constructor() {
    this.httpService = new HttpService();
    this.cacheService = new CacheService(this.CACHE_TTL);
    this.retryService = new RetryService(
      {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
        jitter: true,
      },
      {
        maxRequestsPerSecond: 5, // Conservative rate limit for external API
        burstSize: 3,
      },
    );
    this.baseUrl = 'https://ghibliapi.vercel.app';
  }

  async getFilmById(id: string): Promise<GhibliFilm | null> {
    const cacheKey = `film:${id}`;

    // Check cache first
    const cachedFilm = this.cacheService.get<GhibliFilm>(cacheKey);
    if (cachedFilm) {
      return cachedFilm;
    }

    try {
      const response = await this.retryService.executeWithRetry(
        () =>
          this.httpService.get({
            endpoint: `${this.baseUrl}/films/${id}`,
          }),
        `Fetching film ${id}`,
      );

      const film = response.data;

      // Cache the result
      this.cacheService.set(cacheKey, film);

      return film;
    } catch (error) {
      console.error(`Error fetching film with ID ${id}:`, error);
      return null;
    }
  }

  async getAllFilms(): Promise<GhibliFilm[]> {
    const cacheKey = 'films:all';

    // Check cache first
    const cachedFilms = this.cacheService.get<GhibliFilm[]>(cacheKey);
    if (cachedFilms) {
      return cachedFilms;
    }

    try {
      const response = await this.retryService.executeWithRetry(
        () =>
          this.httpService.get({
            endpoint: `${this.baseUrl}/films`,
          }),
        'Fetching all films',
      );

      const films = response.data;

      // Cache the result
      this.cacheService.set(cacheKey, films);

      return films;
    } catch (error) {
      console.error('Error fetching all films:', error);
      return [];
    }
  }

  async getMainFilms(): Promise<GhibliFilm[]> {
    const cacheKey = 'films:main';

    // Check cache first
    const cachedMainFilms = this.cacheService.get<GhibliFilm[]>(cacheKey);
    if (cachedMainFilms) {
      return cachedMainFilms;
    }

    const mainFilmIds = [
      'ebbb6b7c-945c-41ee-a792-de0e43191bd8', // Porco Rosso
      'ea660b10-85c4-4ae3-8a5f-41cea3648e3e', // Kiki's Delivery Service
      'cd3d059c-09f4-4ff3-8d63-bc765a5184fa', // Howl's Moving Castle
      '58611129-2dbc-4a81-a72f-77ddfc1b1b49', // My Neighbor Totoro
    ];

    try {
      const filmPromises = mainFilmIds.map((id) => this.getFilmById(id));
      const films = await Promise.all(filmPromises);

      // Filter out any null results (failed requests)
      const validFilms = films.filter(
        (film): film is GhibliFilm => film !== null,
      );

      // Cache the result
      this.cacheService.set(cacheKey, validFilms);

      return validFilms;
    } catch (error) {
      console.error('Error fetching main films:', error);
      return [];
    }
  }
}
