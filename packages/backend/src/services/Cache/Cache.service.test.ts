import { CacheService } from './Cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
  });

  describe('set and get', () => {
    it('should store and retrieve data correctly', () => {
      const testData = { id: 1, name: 'test' };
      cacheService.set('test-key', testData);

      const result = cacheService.get('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const result = cacheService.get('non-existent');
      expect(result).toBeNull();
    });

    it('should return null for expired items', () => {
      // Create cache with very short TTL (1ms)
      const shortTTLCache = new CacheService(1);
      const testData = { id: 1, name: 'test' };

      shortTTLCache.set('test-key', testData);

      // Wait for expiration
      setTimeout(() => {
        const result = shortTTLCache.get('test-key');
        expect(result).toBeNull();
      }, 10);
    });
  });

  describe('has', () => {
    it('should return true for existing keys', () => {
      cacheService.set('test-key', { data: 'test' });
      expect(cacheService.has('test-key')).toBe(true);
    });

    it('should return false for non-existent keys', () => {
      expect(cacheService.has('non-existent')).toBe(false);
    });

    it('should return false for expired items', () => {
      const shortTTLCache = new CacheService(1);
      shortTTLCache.set('test-key', { data: 'test' });

      setTimeout(() => {
        expect(shortTTLCache.has('test-key')).toBe(false);
      }, 10);
    });
  });

  describe('delete', () => {
    it('should delete existing keys', () => {
      cacheService.set('test-key', { data: 'test' });
      expect(cacheService.has('test-key')).toBe(true);

      const deleted = cacheService.delete('test-key');
      expect(deleted).toBe(true);
      expect(cacheService.has('test-key')).toBe(false);
    });

    it('should return false when deleting non-existent keys', () => {
      const deleted = cacheService.delete('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all cached items', () => {
      cacheService.set('key1', { data: 'test1' });
      cacheService.set('key2', { data: 'test2' });

      expect(cacheService.size()).toBe(2);

      cacheService.clear();
      expect(cacheService.size()).toBe(0);
      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
    });
  });

  describe('size', () => {
    it('should return correct cache size', () => {
      expect(cacheService.size()).toBe(0);

      cacheService.set('key1', { data: 'test1' });
      expect(cacheService.size()).toBe(1);

      cacheService.set('key2', { data: 'test2' });
      expect(cacheService.size()).toBe(2);

      cacheService.delete('key1');
      expect(cacheService.size()).toBe(1);
    });
  });

  describe('cleanup', () => {
    it('should remove expired items', () => {
      const shortTTLCache = new CacheService(1);

      shortTTLCache.set('expired-key', { data: 'expired' });
      shortTTLCache.set('valid-key', { data: 'valid' }, 1000); // 1 second TTL

      expect(shortTTLCache.size()).toBe(2);

      // Wait for first item to expire
      setTimeout(() => {
        shortTTLCache.cleanup();
        expect(shortTTLCache.size()).toBe(1);
        expect(shortTTLCache.get('expired-key')).toBeNull();
        expect(shortTTLCache.get('valid-key')).not.toBeNull();
      }, 10);
    });
  });

  describe('custom TTL', () => {
    it('should use custom TTL when provided', () => {
      const customTTLCache = new CacheService(1000); // 1 second default

      customTTLCache.set('key1', { data: 'test1' }); // Uses default TTL
      customTTLCache.set('key2', { data: 'test2' }, 500); // Uses custom TTL

      setTimeout(() => {
        expect(customTTLCache.get('key1')).not.toBeNull(); // Still valid
        expect(customTTLCache.get('key2')).toBeNull(); // Expired
      }, 600);
    });
  });
});
