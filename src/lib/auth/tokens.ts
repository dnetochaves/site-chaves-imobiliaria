const ACCESS_TOKEN_KEY = "chaves.auth.access_token";
const REFRESH_TOKEN_KEY = "chaves.auth.refresh_token";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export function getTokens(): Tokens | null {
  if (typeof window === "undefined") return null;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function setTokens(tokens: Tokens): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function setAccessToken(accessToken: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearTokens(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}
