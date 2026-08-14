let authToken = null;

// El token vive en memoria (no en AsyncStorage) para que http.js lo lea sin
// esperar una promesa en cada request. AuthContext lo sincroniza en login/logout.
export function setAuthToken(token) {
  authToken = token;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function buildHeaders(isExternal) {
  if (isExternal) {
    return { "Content-Type": "application/json" };
  }
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  return headers;
}

async function request(method, url, body) {
  const isExternal = !url.startsWith(API_URL);
  const res = await fetch(url, {
    method,
    headers: buildHeaders(isExternal),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${method} ${url} -> ${res.status}: ${text}`);
  }
  return res.json();
}

export const http = {
  get: (url) => request("GET", url),
  post: (url, body) => request("POST", url, body),
  put: (url, body) => request("PUT", url, body),
  del: (url) => request("DELETE", url),
};
