import { apiClient } from "@/lib/api/client";

export async function exchangeCode(code: string) {
  const { data, error } = await apiClient.POST("/auth/exchange", {
    body: { code },
  });
  if (error) throw error;
  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const { data, error } = await apiClient.POST("/auth/refresh", {
    body: { refresh_token: refreshToken },
  });
  if (error) throw error;
  return data;
}

export async function logoutSession(refreshToken: string) {
  const { error } = await apiClient.POST("/auth/logout", {
    body: { refresh_token: refreshToken },
  });
  if (error) throw error;
}

export async function fetchCurrentUser() {
  const { data, error } = await apiClient.GET("/auth/me");
  if (error) throw error;
  return data;
}
