import { API_BASE_URL, ROUTES, STORAGE_KEYS } from '../constants/Config';
import type { LoginRequest, LoginResponse, User } from '../types/User';

/**
 * Se connecte au backend et stocke le token + user info en localStorage.
 * Vérifie aussi que le rôle est ADMIN.
 */
export async function login(credentials: LoginRequest): Promise<User> {
  const response = await fetch(`${API_BASE_URL}${ROUTES.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const data: LoginResponse = await response.json();

  // Vérifie que c'est bien un admin
  if (data.role !== 'ADMIN') {
    throw new Error("Accès refusé : vous n'êtes pas administrateur");
  }

  // Stocke le token et les infos utilisateur
  localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, data.token);
  const user: User = {
    userId: data.userId,
    mail: data.mail,
    prenom: data.prenom,
    nom: data.nom,
    role: data.role,
  };
  localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));

  return user;
}

/**
 * Récupère le token JWT depuis le localStorage.
 */
export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
}

/**
 * Récupère l'utilisateur connecté depuis le localStorage.
 */
export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEYS.USER_INFO);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Vérifie si l'utilisateur est connecté ET admin.
 */
export function isLoggedIn(): boolean {
  const token = getToken();
  const user = getCurrentUser();
  return token !== null && user !== null && user.role === 'ADMIN';
}

/**
 * Déconnecte l'utilisateur (vide le localStorage).
 */
export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
}