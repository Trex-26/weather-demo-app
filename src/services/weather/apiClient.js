/**
 * Resilient HTTP client with timeout, exponential backoff retries, and abort support.
 */

export class ApiError extends Error {
  constructor(message, status = null, code = 'API_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export class TimeoutError extends ApiError {
  constructor(message = 'Request timed out') {
    super(message, 408, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network connection failed') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/**
 * Fetch with configurable timeout, retries, and backoff.
 * 
 * @param {string} url 
 * @param {object} options 
 * @param {number} [options.timeout=10000] - Request timeout in ms
 * @param {number} [options.retries=2] - Number of retry attempts on retryable errors
 * @param {number} [options.backoffMs=500] - Base backoff duration in ms
 * @param {AbortSignal} [options.signal] - Caller's abort signal
 * @returns {Promise<any>} Parsed JSON response
 */
export async function fetchJson(url, options = {}) {
  // Validate URL scheme to prevent protocol manipulation or dangerous schemes
  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new ApiError(`Invalid URL scheme: ${parsedUrl.protocol}`, null, 'INVALID_URL');
    }
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError('Malformed or invalid URL provided', null, 'INVALID_URL');
  }

  const {
    timeout = 10000,
    retries = 2,
    backoffMs = 500,
    signal: externalSignal,
    ...fetchOptions
  } = options;

  let attempt = 0;

  while (attempt <= retries) {
    const controller = new AbortController();
    let timeoutId = null;

    // Link external abort signal if provided
    const abortHandler = () => controller.abort();
    if (externalSignal) {
      if (externalSignal.aborted) {
        throw new ApiError('Request was aborted', null, 'ABORTED');
      }
      externalSignal.addEventListener('abort', abortHandler, { once: true });
    }

    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      if (!response.ok) {
        // Only retry 5xx server errors or 429 rate limits
        const isRetryable = response.status >= 500 || response.status === 429;
        if (isRetryable && attempt < retries) {
          attempt++;
          const delay = backoffMs * Math.pow(2, attempt - 1) + Math.random() * 200;
          await new Promise((res) => setTimeout(res, delay));
          continue;
        }

        let errorBody = null;
        try {
          errorBody = await response.json();
        } catch {
          // Response was not JSON
        }

        const msg = errorBody?.reason || errorBody?.message || `API request failed with status ${response.status}`;
        throw new ApiError(msg, response.status, `HTTP_${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      if (externalSignal?.aborted) {
        throw new ApiError('Request was aborted', null, 'ABORTED');
      }

      if (err.name === 'AbortError') {
        let hostname = 'endpoint';
        try { hostname = new URL(url).hostname; } catch { /* ignore */ }
        throw new TimeoutError(`Request to ${hostname} timed out after ${timeout}ms`);
      }

      if (err instanceof ApiError) {
        throw err;
      }

      // Network / connection error
      if (attempt < retries) {
        attempt++;
        const delay = backoffMs * Math.pow(2, attempt - 1) + Math.random() * 200;
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      throw new NetworkError(err.message || 'Network request failed. Please check your internet connection.');
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      if (externalSignal) {
        externalSignal.removeEventListener('abort', abortHandler);
      }
    }
  }
}
