# Cloudinary Integration - Guide Complet

## 📋 Vue d'ensemble

Le projet utilise désormais **Cloudinary** pour stocker, optimiser et servir toutes les images. Cela remplace le système d'upload local précédent.

## 🔧 Configuration

### Variables d'environnement (.env)

```env
CLOUDINARY_CLOUD_NAME=dz62ihibb
CLOUDINARY_API_KEY=323981455886258
CLOUDINARY_API_SECRET=xsOVj7PNx5Miel8b20x2idItJUw
```

Ces variables sont déjà configurées et utilisées par le backend.

## 📁 Structure des dossiers Cloudinary

Les images sont organisées dans Cloudinary sous le dossier `airbnb-app`:

- `airbnb-app/` - Dossier principal
  - `services/` - Images des services
  - `apartments/` - Images des appartements
  - `room-details/` - Images des détails de chambre

## 🚀 Utilisation

### Backend (Node.js/Express)

#### Middleware Cloudinary

Fichier: `backend/src/middleware/cloudinary.middleware.ts`

Le middleware gère:
- Upload des fichiers via multer (en mémoire)
- Transmission à Cloudinary
- Retour de l'URL sécurisée et du publicId

```typescript
import { upload, uploadToCloudinary } from '../middleware/cloudinary.middleware';

// Dans une route
router.post('/upload', 
  authenticate, 
  upload.single('image'), 
  uploadToCloudinary, 
  (req, res) => {
    // req.cloudinaryUrl - URL sécurisée Cloudinary
    // req.cloudinaryPublicId - ID public pour suppression
  }
);
```

#### Routes mises à jour

- `POST /apartments/upload` - Upload pour les appartements
- `POST /services/upload` - Upload pour les services
- `POST /room-details/upload` - Upload pour les détails de chambre

Chaque route retourne:
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "airbnb-app/...",
  "success": true
}
```

### Frontend (React)

#### Utilitaires d'images

Fichier: `src/utils/imageUtils.ts`

Fonctions disponibles:

```typescript
// Normaliser une URL (support Cloudinary, local, externe)
normalizeImageUrl(url: string): string

// Générer une URL optimisée Cloudinary
getOptimizedCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: 'auto' | 'low' | 'medium' | 'high';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}): string

// Déterminer la source d'une image
getImageSource(url: string): 'cloudinary' | 'local' | 'external'

// Ajouter un cache-buster
addCacheBuster(url: string): string

// Extraire le publicId d'une URL Cloudinary
extractCloudinaryPublicId(url: string): string | null
```

#### Service d'upload

Fichier: `src/services/imageUploadService.ts`

```typescript
import { imageUploadService } from '@/services/imageUploadService';

// Upload pour les services
const response = await imageUploadService.uploadServiceImage(file);

// Upload pour les appartements
const response = await imageUploadService.uploadApartmentImage(file);

// Upload pour les détails de chambre
const response = await imageUploadService.uploadRoomDetailImage(file);
```

#### Affichage des images

Les composants gèrent automatiquement les URLs Cloudinary:

```typescript
<img 
  src={normalizeImageUrl(imageUrl)} 
  alt="description"
/>
```

## ✨ Avantages de Cloudinary

1. **Optimization automatique**
   - Compression d'images automatique
   - Conversion de format (WebP, etc.)
   - Responsive images

2. **Stockage sécurisé**
   - Pas de stockage local
   - Pas d'espace disque utilisé
   - Accès sécurisé via URLs

3. **Gestion des versions**
   - Historique des images
   - Rollback possible
   - Versioning automatique

4. **Accélération globale**
   - CDN mondial
   - Chargement rapide
   - Cache automatique

5. **Suppression facile**
   - Via `deleteFromCloudinary(publicId)`
   - Nettoyage des anciennes versions

## 🛠️ Gestion des images uploadées

### Upload d'une image

```typescript
// Depuis le frontend
const file = e.target.files[0];
const response = await imageUploadService.uploadApartmentImage(file);
const imageUrl = response.url; // URL Cloudinary directe
```

### Affichage de l'image

```typescript
<img src={normalizeImageUrl(imageUrl)} alt="description" />
// normalizeImageUrl détecte automatiquement que c'est Cloudinary
```

### Suppression d'une image

```typescript
import { deleteFromCloudinary } from '@/middleware/cloudinary.middleware';

await deleteFromCloudinary(publicId);
```

## 📊 Monitoring

### URLs Cloudinary

Format standard:
```
https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{TRANSFORMATIONS}/{PUBLIC_ID}
```

Exemple:
```
https://res.cloudinary.com/dz62ihibb/image/upload/q_auto,f_auto/airbnb-app/services/image.jpg
```

### Tableau de bord

Accédez à: https://cloudinary.com/console/

Login avec:
- Email: nicolasromanina@gmail.com
- Cloud: dz62ihibb

## ⚠️ Important

1. **Ne pas utiliser les uploads locaux** - Tous les uploads doivent passer par Cloudinary
2. **Répertoire /uploads supprimé** - Les images ne sont plus stockées localement
3. **URLs compatibles** - Le code détecte automatiquement les URLs Cloudinary vs locales
4. **Pas de modification locale** - Les images ne doivent pas être éditées localement

## 🔐 Sécurité

- Les uploads requièrent une authentification (`authenticate` middleware)
- Les URLs retournées sont sécurisées (HTTPS)
- Les publicIds sont stockés pour la gestion d'accès
- Nettoyage automatique des anciennes versions

## 📚 Ressources

- Documentation Cloudinary: https://cloudinary.com/documentation
- API Reference: https://cloudinary.com/documentation/image_upload_api
- Dashboard: https://cloudinary.com/console/cloudinary.com/console/

---

**Dernier update**: 27 Janvier 2026
**Responsable**: Équipe développement
