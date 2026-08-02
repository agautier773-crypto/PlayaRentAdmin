// Config global de l'app admin 

const DEV_API_URL = 'http://localhost:8080/api';
const PROD_API_URL = 'https://api.playa-rent.fr/api';

export const API_BASE_URL = import.meta.env.PROD ? PROD_API_URL : DEV_API_URL;

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