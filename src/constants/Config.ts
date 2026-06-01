// Config global de l'app admin 

export const API_BASE_URL = 'http://localhost:8080/api';

// Routes de l'API
export const ROUTES = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  STATIONS: '/stations',
  STATIONS_CONFIG: '/stations-config',
};

// Clés de stockage local (localStorage)
export const STORAGE_KEYS = {
  JWT_TOKEN: 'playarent_admin_jwt',
  REFRESH_TOKEN: 'playarent_admin_refresh',
  USER_INFO: 'playarent_admin_user',
};