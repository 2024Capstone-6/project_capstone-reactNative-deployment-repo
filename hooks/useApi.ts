import { useState } from 'react';
import { HttpClient } from '../utils/httpClient';
import { ApiResponse } from '../types';

export const useApi = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ) => {
    setLoading(true);
    setError(null);

    try {
      let response: ApiResponse<T>;
      switch (method) {
        case 'get':
          response = await HttpClient.get(endpoint, headers);
          break;
        case 'post':
          response = await HttpClient.post(endpoint, body, headers);
          break;
        case 'put':
          response = await HttpClient.put(endpoint, body, headers);
          break;
        case 'delete':
          response = await HttpClient.delete(endpoint, headers);
          break;
      }

      if (response.error) {
        throw new Error(response.error);
      }

      setData(response.data || null);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    execute,
  };
};
