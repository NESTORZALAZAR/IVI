const configuredApiUrl = process.env.REACT_APP_API_URL || "/api";

export const API_URL = configuredApiUrl.replace(/\/+$/, "");

export function apiUrl(path) {
  return `${API_URL}/${path.replace(/^\/+/, "")}`;
}
