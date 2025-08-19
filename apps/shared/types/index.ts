// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}

export interface HelloResponse {
  message: string;
  timestamp: number;
}

export interface CssSubmitRequest {
  css: string;
  timestamp: number;
}

export interface CssSubmitResponse {
  success: boolean;
  id: string;
  savedAt: number;
}

export interface ErrorResponse {
  error: true;
  message: string;
  code?: string;
  timestamp: number;
}