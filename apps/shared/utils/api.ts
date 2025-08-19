import type { ApiResponse, HelloResponse, CssSubmitRequest, CssSubmitResponse } from '../types/index.js';

// API base URL configuration
export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return window.location.origin;
  }
  // Server environment
  return process.env.API_URL || 'http://localhost:8788';
};

// API utility functions
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || getApiUrl();
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      const data = await response.json();
      
      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : { code: response.status.toString(), message: data.message || 'Unknown error' },
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred'
        },
        timestamp: Date.now()
      };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : { code: response.status.toString(), message: data.message || 'Unknown error' },
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred'
        },
        timestamp: Date.now()
      };
    }
  }

  // Specific API methods
  async hello(name?: string): Promise<ApiResponse<HelloResponse>> {
    const endpoint = name ? `/api/hello?name=${encodeURIComponent(name)}` : '/api/hello';
    return this.get<HelloResponse>(endpoint);
  }

  async saveCss(cssData: CssSubmitRequest): Promise<ApiResponse<CssSubmitResponse>> {
    return this.post<CssSubmitResponse>('/api/css', cssData);
  }
}

// Default instance
export const apiClient = new ApiClient();