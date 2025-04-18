import { ENV } from '../config/env';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export class HttpClient {
  private static baseUrl = ENV.API_URL;
  private static defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  static async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...options.headers };

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return response.json();
    } catch (error) {
      console.error('HTTP request failed:', error);
      throw error;
    }
  }

  static async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { headers });
  }

  static async post<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: data, headers });
  }

  static async put<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: data, headers });
  }

  static async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}
