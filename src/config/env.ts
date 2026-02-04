// config/env.ts
export const config = {
  // API Base URL - Utilise le bon domaine pour production
  apiBaseUrl: import.meta.env.VITE_API_URL || 'https://api.wmsignaturegroup.com/api',
  
  // Stripe Configuration
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  
  // Feature flags
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  
  // URLs complètes pour les différents environnements
  urls: {
    production: 'https://api.wmsignaturegroup.com/api',
    development: import.meta.env.VITE_API_URL || 'http://api.wmsignaturegroup.com/api',
    staging: 'https://api-staging.wmsignaturegroup.com/api',
    test: 'https://api-test.wmsignaturegroup.com/api'
  } as const,
  
  // Configuration spécifique par service
  services: {
    apartment: '/apartment',
    apartmentDetails: '/apartment-details',
    roomDetails: '/room-details',
    additionalOptions: '/options',
    search: '/search',
    home: '/home',
    services: '/services',
    contact: '/contact',
    footer: '/footer',
    payments: '/payments',
    auth: '/auth',
    cms: '/cms',
    upload: '/upload'
  } as const
} as const;

// Fonction pour obtenir l'URL de base appropriée
export const getBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    return config.urls.production;
  }
  if (import.meta.env.DEV) {
    return config.urls.development;
  }
  return config.apiBaseUrl;
};

const normalizeUrl = (url: string): string => {
  // Si l'URL est déjà complète avec protocole, la retourner telle quelle
  if (/^https?:\/\//.test(url)) {
    return url;
  }
  
  // Si c'est une URL relative dans le navigateur
  if (typeof window !== 'undefined') {
    if (/^\/\//.test(url)) return window.location.protocol + url;
    if (!/^https?:\/\//.test(url)) return window.location.protocol + '//' + url.replace(/^[\.\/]+/, '');
  }
  return url;
};

// Returns an absolute URL when possible, preventing protocol-relative or dot-prefixed hosts
export const getNormalizedBaseUrl = (): string => normalizeUrl(getBaseUrl());

// Fonction pour obtenir l'URL complète d'un service
export const getServiceUrl = (service: keyof typeof config.services): string => {
  const baseUrl = getBaseUrl();
  const endpoint = config.services[service];
  return `${baseUrl}${endpoint}`;
};

// Validation des variables d'environnement
export const validateEnv = () => {
  const required = ['VITE_API_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn(`Variables d'environnement manquantes: ${missing.join(', ')}`);
  }
};

export type AppConfig = typeof config;