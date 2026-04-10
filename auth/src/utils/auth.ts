import { decodeToken } from "./jwt";

const TOKEN_KEY = "mfe_token";
const USER_KEY  = "mfe_user";

export function saveAuth(token: string, user: object) {
  const decoded = decodeToken(token);

  const userWithId = {
    ...user,
    id: decoded?.userId, 
    role: decoded?.role, 
  };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userWithId));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}