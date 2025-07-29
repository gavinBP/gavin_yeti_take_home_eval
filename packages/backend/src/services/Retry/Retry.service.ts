interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

interface ThrottleConfig {
  maxRequestsPerSecond: number;
  burstSize: number;
}

export class RetryService {
  private config: RetryConfig;
  private throttleConfig: ThrottleConfig;
  private requestQueue: Array<() => Promise<any>> = [];
  private lastRequestTime: number = 0;
  private requestCount: number = 0;
  private lastResetTime: number = Date.now();

  constructor(
    retryConfig?: Partial<RetryConfig>,
    throttleConfig?: Partial<ThrottleConfig>,
  ) {
    this.config = {
      maxRetries: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 30000, // 30 seconds
      backoffMultiplier: 2,
      jitter: true,
      ...retryConfig,
    };

    this.throttleConfig = {
      maxRequestsPerSecond: 10,
      burstSize: 5,
      ...throttleConfig,
    };
  }

  private calculateDelay(attempt: number): number {
    const delay = Math.min(
      this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt),
      this.config.maxDelay,
    );

    if (this.config.jitter) {
      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay;
      return delay + jitter;
    }

    return delay;
  }

  private async throttle(): Promise<void> {
    const now = Date.now();

    // Reset counter if a second has passed
    if (now - this.lastResetTime >= 1000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    // Check if we're within rate limits
    if (this.requestCount >= this.throttleConfig.maxRequestsPerSecond) {
      const waitTime = 1000 - (now - this.lastResetTime);
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.throttle(); // Recursive call after waiting
      }
    }

    // Ensure minimum delay between requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minDelay = 1000 / this.throttleConfig.maxRequestsPerSecond;

    if (timeSinceLastRequest < minDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, minDelay - timeSinceLastRequest),
      );
    }

    this.requestCount++;
    this.lastRequestTime = Date.now();
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context?: string,
  ): Promise<T> {
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        // Apply throttling
        await this.throttle();

        // Execute the operation
        const result = await operation();
        return result;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on the last attempt
        if (attempt === this.config.maxRetries) {
          break;
        }

        // Check if error is retryable
        if (!this.isRetryableError(error as Error)) {
          throw error;
        }

        // Calculate delay for next attempt
        const delay = this.calculateDelay(attempt);

        console.warn(
          `${context || 'Operation'} failed (attempt ${attempt + 1}/${
            this.config.maxRetries + 1
          }): ${error}. Retrying in ${Math.round(delay)}ms`,
        );

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error(
      `${context || 'Operation'} failed after ${
        this.config.maxRetries + 1
      } attempts. Last error: ${lastError?.message}`,
    );
  }

  private isRetryableError(error: Error): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    const retryableErrors = [
      'ECONNRESET',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ECONNABORTED',
    ];

    const retryableMessages = [
      'timeout',
      'network',
      'connection',
      'server error',
      'internal server error',
    ];

    // Check error code
    if (retryableErrors.some((code) => error.message.includes(code))) {
      return true;
    }

    // Check error message
    if (
      retryableMessages.some((msg) => error.message.toLowerCase().includes(msg))
    ) {
      return true;
    }

    // Check for HTTP status codes (if available)
    if ('status' in error && typeof (error as any).status === 'number') {
      const status = (error as any).status;
      return status >= 500 || status === 429; // 5xx errors or rate limit
    }

    return false;
  }

  // Queue management for burst handling
  async queueRequest<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.executeWithRetry(operation);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.requestQueue.length === 0) {
      return;
    }

    const operation = this.requestQueue.shift();
    if (operation) {
      await operation();
      // Process next item in queue
      setImmediate(() => this.processQueue());
    }
  }

  // Get current queue status
  getQueueStatus() {
    return {
      queueLength: this.requestQueue.length,
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
    };
  }
}
