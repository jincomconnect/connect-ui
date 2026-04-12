export type AppProfile = 'development' | 'test' | 'production';

const fallbackApiBaseUrl = 'http://localhost:8080/api';

const appEnv = import.meta.env.VITE_APP_ENV ?? 'development';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? fallbackApiBaseUrl;

export const appConfig = {
  appEnv: appEnv as AppProfile,
  apiBaseUrl,
} as const;

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${appConfig.apiBaseUrl.replace(/\/$/, '')}${normalizedPath}`;
}