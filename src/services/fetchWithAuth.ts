import { API_BASE_URL, ROUTES, STORAGE_KEYS } from '../constants/Config';

// Callback à appeler quand la session expire (refresh impossible)
let onSessionExpiredCallback: (() => void) | null = null;

export function setOnSessionExpired(callback: () => void) {
    onSessionExpiredCallback = callback;
}

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
        throw new Error('Aucun refresh token disponible');
    }

    const response = await fetch(`${API_BASE_URL}${ROUTES.REFRESH}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        throw new Error('Refresh token invalide ou expiré');
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;

    // Stocke le nouveau access token
    localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, newAccessToken);

    return newAccessToken;
}

function clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response>{
        // Récupère le token actuel
    const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
    
    if (!token) {
        throw new SessionExpiredError('Aucun token disponible');
    }

    // Construit l'URL complète
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    // Construit les headers (Authorization en dernier pour ne pas être écrasé)
    // Pas de content-type pour formData 
    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers as Record<string, string>),
        'Authorization': `Bearer ${token}`,
    };

    const optionsWithAuth: RequestInit = {
        ...options,
        headers,
    };

    // Première tentative
    let response = await fetch(url, optionsWithAuth);

    // Si pas 401, on retourne la réponse telle quelle
    if (response.status !== 401) {
        return response;
    }

    // C'est un 401 : on vérifie si c'est un TOKEN_EXPIRED
    const errorData = await response.clone().json().catch(() => null);
    
    if (errorData?.error !== 'TOKEN_EXPIRED') {
    
        return response;
    }

    // Token expiré : on tente de le renouveler
    try {
        let newToken: string;
        if (isRefreshing && refreshPromise) {
            newToken = await refreshPromise;
        } else {
            isRefreshing = true;
            refreshPromise = refreshAccessToken();
            try {
                newToken = await refreshPromise;
            } finally {
                isRefreshing = false;
                refreshPromise = null;
            }
        }

        // Refait la requête avec le nouveau token
            const newOptions: RequestInit = {
                ...options,
                headers: {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    ...(options.headers as Record<string, string>),
                    'Authorization': `Bearer ${newToken}`,
                },
            };

        response = await fetch(url, newOptions);
        return response;

    } catch (refreshError) {
        // Le refresh a échoué : session vraiment morte
        clearSession();
        
        // Notifie l'app pour qu'elle redirige vers /login
        if (onSessionExpiredCallback) {
            onSessionExpiredCallback();
        }
        
        throw new SessionExpiredError('Session expirée, veuillez vous reconnecter');
    }
}

export class SessionExpiredError extends Error {
      constructor(message: string = 'Session expirée') {
          super(message);
          this.name = 'SessionExpiredError';
      }
  }