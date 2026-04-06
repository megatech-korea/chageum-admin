// types/api.ts
export type IsoDateTimeString = string;

export interface ErrorResponse {
  code: string;
  message: string;
  status: number;
  detail?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ErrorResponse | null;
  path: string;
  timestamp: IsoDateTimeString;
}

export const isApiSuccess = <T>(
  res: ApiResponse<T>,
): res is ApiResponse<T> & { success: true; data: T | null; error: null } =>
  res.success === true;

export const isApiFail = <T>(
  res: ApiResponse<T>,
): res is ApiResponse<T> & {
  success: false;
  data: null;
  error: ErrorResponse;
} => res.success === false;
