import { RetryService } from './Retry.service';

describe('RetryService', () => {
  let retryService: RetryService;

  beforeEach(() => {
    retryService = new RetryService();
  });

  describe('executeWithRetry', () => {
    it('should execute successfully on first attempt', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      const result = await retryService.executeWithRetry(operation);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockResolvedValue('success');

      const result = await retryService.executeWithRetry(
        operation,
        'Test operation',
      );

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should fail after max retries', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(
        retryService.executeWithRetry(operation, 'Test operation'),
      ).rejects.toThrow('Test operation failed after 4 attempts');

      expect(operation).toHaveBeenCalledTimes(4); // Initial + 3 retries
    }, 10000); // Increase timeout

    it('should not retry non-retryable errors', async () => {
      const operation = jest
        .fn()
        .mockRejectedValue(new Error('Validation error'));

      await expect(retryService.executeWithRetry(operation)).rejects.toThrow(
        'Validation error',
      );

      expect(operation).toHaveBeenCalledTimes(1); // No retries
    });

    it('should retry on network errors', async () => {
      const networkErrors = [
        new Error('ECONNRESET'),
        new Error('ECONNREFUSED'),
        new Error('ETIMEDOUT'),
        new Error('ENOTFOUND'),
        new Error('ECONNABORTED'),
      ];

      for (const error of networkErrors) {
        const operation = jest
          .fn()
          .mockRejectedValueOnce(error)
          .mockResolvedValue('success');

        const result = await retryService.executeWithRetry(operation);
        expect(result).toBe('success');
        expect(operation).toHaveBeenCalledTimes(2);
      }
    }, 15000); // Increase timeout

    it('should retry on server errors', async () => {
      const serverError = new Error('Internal Server Error');
      (serverError as any).status = 500;

      const operation = jest
        .fn()
        .mockRejectedValueOnce(serverError)
        .mockResolvedValue('success');

      const result = await retryService.executeWithRetry(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should retry on rate limit errors', async () => {
      const rateLimitError = new Error('Too Many Requests');
      (rateLimitError as any).status = 429;

      const operation = jest
        .fn()
        .mockRejectedValueOnce(rateLimitError)
        .mockResolvedValue('success');

      const result = await retryService.executeWithRetry(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });

  describe('custom configuration', () => {
    it('should use custom retry configuration', async () => {
      const customRetryService = new RetryService({
        maxRetries: 1,
        baseDelay: 100,
        maxDelay: 1000,
      });

      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');

      const result = await customRetryService.executeWithRetry(operation);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    it('should use custom throttle configuration', async () => {
      const customRetryService = new RetryService(undefined, {
        maxRequestsPerSecond: 2,
        burstSize: 1,
      });

      const startTime = Date.now();

      // Make 3 requests - should be throttled
      const promises = [
        customRetryService.executeWithRetry(() => Promise.resolve('1')),
        customRetryService.executeWithRetry(() => Promise.resolve('2')),
        customRetryService.executeWithRetry(() => Promise.resolve('3')),
      ];

      await Promise.all(promises);
      const endTime = Date.now();

      // Should take at least 500ms due to throttling (2 req/sec)
      expect(endTime - startTime).toBeGreaterThan(400);
    });
  });

  describe('queueRequest', () => {
    it('should queue requests and process them', async () => {
      const operation1 = jest.fn().mockResolvedValue('result1');
      const operation2 = jest.fn().mockResolvedValue('result2');

      const promise1 = retryService.queueRequest(operation1);
      const promise2 = retryService.queueRequest(operation2);

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBe('result1');
      expect(result2).toBe('result2');
      expect(operation1).toHaveBeenCalled();
      expect(operation2).toHaveBeenCalled();
    });
  });

  describe('getQueueStatus', () => {
    it('should return queue status', () => {
      const status = retryService.getQueueStatus();

      expect(status).toHaveProperty('queueLength');
      expect(status).toHaveProperty('requestCount');
      expect(status).toHaveProperty('lastRequestTime');
    });
  });

  describe('delay calculation', () => {
    it('should calculate exponential backoff delays', async () => {
      const customRetryService = new RetryService({
        baseDelay: 100, // Reduced for faster testing
        backoffMultiplier: 2,
        maxDelay: 1000,
      });

      const operation = jest.fn().mockRejectedValue(new Error('Network error'));

      const startTime = Date.now();

      try {
        await customRetryService.executeWithRetry(operation);
      } catch (error) {
        // Expected to fail after retries
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should have delays: 100ms + 200ms + 400ms = 700ms minimum
      expect(totalTime).toBeGreaterThan(600);
    }, 10000); // Increase timeout
  });
});
