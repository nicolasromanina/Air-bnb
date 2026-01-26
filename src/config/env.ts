// config/env.ts
export const config = {
  // API Base URL
  apiBaseUrl: import.meta.env.VITE_API_URL || 'https://airbnb-backend.onrender.com/api',
  
  // Stripe Configuration
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  
  // Feature flags
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  
  // Supabase (si vous l'utilisez encore pour d'autres fonctionnalités)
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;

// Validation des variables d'environnement
export const validateEnv = () => {
  const required = ['VITE_API_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn(`Variables d'environnement manquantes: ${missing.join(', ')}`);
  }
};

export type AppConfig = typeof config;