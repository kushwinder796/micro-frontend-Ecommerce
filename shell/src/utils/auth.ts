const TOKEN_KEY = "token";
const USER_KEY  = "user";

export function saveAuth(token: string, user: object) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("mfe_token");
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY) || localStorage.getItem("mfe_user");
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}