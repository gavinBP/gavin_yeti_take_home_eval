import { GhibliAPIService, GhibliFilm } from './GhibliAPI.service';
import { HttpService } from '../Http/Http.service';

// Mock the HttpService
jest.mock('../Http/Http.service');

const mockHttpService = {
  get: jest.fn(),
  post: jest.fn(),
};

(HttpService as jest.MockedClass<typeof HttpService>).mockImplementation(
  () => mockHttpService as any,
);

describe('GhibliAPIService', () => {
  let ghibliService: GhibliAPIService;

  beforeEach(() => {
    jest.clearAllMocks();
    ghibliService = new GhibliAPIService();
  });

  describe('getFilmById', () => {
    it('should fetch a film by ID successfully', async () => {
      const mockFilm: GhibliFilm = {
        id: '58611129-2dbc-4a81-a72f-77ddfc1b1b49',
        title: 'My Neighbor Totoro',
        description: 'Two sisters move to the country...',
        director: 'Hayao Miyazaki',
        release_date: '1988-04-16',
        running_time: '86',
        image: 'https://example.com/image.jpg',
        movie_banner: 'https://example.com/banner.jpg',
        rt_score: '94',
      };

      mockHttpService.get = jest.fn().mockResolvedValue({ data: mockFilm });

      const result = await ghibliService.getFilmById(
        '58611129-2dbc-4a81-a72f-77ddfc1b1b49',
      );

      expect(result).toEqual(mockFilm);
      expect(mockHttpService.get).toHaveBeenCalledWith({
        endpoint:
          'https://ghibliapi.vercel.app/films/58611129-2dbc-4a81-a72f-77ddfc1b1b49',
      });
    });

    it('should return null when film is not found', async () => {
      mockHttpService.get = jest.fn().mockRejectedValue(new Error('Not found'));

      const result = await ghibliService.getFilmById('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('getAllFilms', () => {
    it('should fetch all films successfully', async () => {
      const mockFilms: GhibliFilm[] = [
        {
          id: '1',
          title: 'Film 1',
          description: 'Description 1',
          director: 'Director 1',
          release_date: '2020-01-01',
          running_time: '90',
          image: 'https://example.com/image1.jpg',
          movie_banner: 'https://example.com/banner1.jpg',
        },
        {
          id: '2',
          title: 'Film 2',
          description: 'Description 2',
          director: 'Director 2',
          release_date: '2020-01-02',
          running_time: '95',
          image: 'https://example.com/image2.jpg',
          movie_banner: 'https://example.com/banner2.jpg',
        },
      ];

      mockHttpService.get = jest.fn().mockResolvedValue({ data: mockFilms });

      const result = await ghibliService.getAllFilms();

      expect(result).toEqual(mockFilms);
      expect(mockHttpService.get).toHaveBeenCalledWith({
        endpoint: 'https://ghibliapi.vercel.app/films',
      });
    });

    it('should return empty array when API call fails', async () => {
      mockHttpService.get = jest.fn().mockRejectedValue(new Error('API Error'));

      const result = await ghibliService.getAllFilms();

      expect(result).toEqual([]);
    });
  });

  describe('getMainFilms', () => {
    it('should fetch the four main films successfully', async () => {
      const mockFilms: GhibliFilm[] = [
        {
          id: 'ebbb6b7c-945c-41ee-a792-de0e43191bd8',
          title: 'Porco Rosso',
          description: 'Description 1',
          director: 'Hayao Miyazaki',
          release_date: '1992-07-18',
          running_time: '94',
          image: 'https://example.com/image1.jpg',
          movie_banner: 'https://example.com/banner1.jpg',
        },
        {
          id: 'ea660b10-85c4-4ae3-8a5f-41cea3648e3e',
          title: "Kiki's Delivery Service",
          description: 'Description 2',
          director: 'Hayao Miyazaki',
          release_date: '1989-07-29',
          running_time: '103',
          image: 'https://example.com/image2.jpg',
          movie_banner: 'https://example.com/banner2.jpg',
        },
      ];

      // Mock the getFilmById method to return our test data
      jest.spyOn(ghibliService, 'getFilmById').mockResolvedValue(mockFilms[0]);
      jest
        .spyOn(ghibliService, 'getFilmById')
        .mockResolvedValueOnce(mockFilms[0]);
      jest
        .spyOn(ghibliService, 'getFilmById')
        .mockResolvedValueOnce(mockFilms[1]);
      jest
        .spyOn(ghibliService, 'getFilmById')
        .mockResolvedValueOnce(mockFilms[0]);
      jest
        .spyOn(ghibliService, 'getFilmById')
        .mockResolvedValueOnce(mockFilms[1]);

      const result = await ghibliService.getMainFilms();

      expect(result).toHaveLength(4);
      expect(ghibliService.getFilmById).toHaveBeenCalledTimes(4);
    });
  });
});
