/**
 * Utilitaires pour gérer les images Cloudinary et locales
 */

export const IMAGE_SOURCES = {
  CLOUDINARY: 'cloudinary',
  LOCAL: 'local',
  EXTERNAL: 'external'
} as const;

/**
 * Normalise une URL d'image pour supporter Cloudinary, les URLs locales et externes
 */
export const normalizeImageUrl = (url: string | any): string => {
  if (!url) return '';
  
  const urlStr = String(url);
  
  // Déjà une URL complète Cloudinary
  if (urlStr.includes('cloudinary.com')) {
    return urlStr;
  }
  
  // URL locale qui commence par /uploads/
  if (urlStr.startsWith('/uploads/')) {
    // Retourner directement l'URL - elle sera une URL Cloudinary maintenant
    return urlStr;
  }
  
  // URL complete du backend
  if (urlStr.includes('airbnb-backend.onrender.com')) {
    return urlStr;
  }
  
  // URL externe (http/https)
  if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
    return urlStr;
  }
  
  // Chemin local sans /uploads/ - ajouter le protocole
  if (urlStr.startsWith('/')) {
    return `${process.env.REACT_APP_API_URL || ''}${urlStr}`;
  }
  
  // Assum c'est un chemin d'asset local
  return `/assets/${urlStr}`;
};

/**
 * Génère une URL d'image Cloudinary avec des paramètres d'optimisation
 */
export const getOptimizedCloudinaryUrl = (
  publicId: string, 
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'low' | 'medium' | 'high';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
): string => {
  if (!publicId) return '';
  
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dz62ihibb';
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto'
  } = options || {};
  
  let url = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  // Ajouter les transformations
  const transforms = [];
  
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  
  if (transforms.length > 0) {
    url += `/${transforms.join(',')}`;
  }
  
  url += `/${publicId}`;
  
  return url;
};

/**
 * Détecte la source d'une image (Cloudinary, locale ou externe)
 */
export const getImageSource = (url: string): typeof IMAGE_SOURCES[keyof typeof IMAGE_SOURCES] => {
  if (!url) return IMAGE_SOURCES.EXTERNAL;
  
  if (url.includes('cloudinary.com')) {
    return IMAGE_SOURCES.CLOUDINARY;
  }
  
  if (url.startsWith('/uploads/') || url.startsWith('/assets/')) {
    return IMAGE_SOURCES.LOCAL;
  }
  
  return IMAGE_SOURCES.EXTERNAL;
};

/**
 * Ajoute un cache-buster à une URL (utile pour forcer le rechargement)
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  
  // Pour Cloudinary, utiliser les transformations
  if (url.includes('cloudinary.com')) {
    // Cloudinary gère le cache automatiquement avec les versions
    return url;
  }
  
  // Pour les autres URLs, ajouter un timestamp
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Extrait l'ID public d'une URL Cloudinary
 */
export const extractCloudinaryPublicId = (url: string): string | null => {
  if (!url.includes('cloudinary.com')) return null;
  
  // Format: https://res.cloudinary.com/cloud/image/upload/v123/public_id.ext
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  
  const pathParts = parts[1].split('/');
  const lastPart = pathParts[pathParts.length - 1];
  
  // Enlever l'extension
  return lastPart.split('.')[0];
};
