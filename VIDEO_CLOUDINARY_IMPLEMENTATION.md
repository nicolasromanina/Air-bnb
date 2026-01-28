# Implémentation des Vidéos Cloudinary

## 📋 Résumé

Ce document décrit comment les vidéos Cloudinary sont maintenant intégrées dans les sections **Welcome Section** et **Video Section** de la page d'accueil. Les utilisateurs peuvent à présent uploader directement des vidéos depuis leur machine locale via Cloudinary au lieu d'utiliser uniquement des URL YouTube.

## 🎯 Fonctionnalités Implémentées

### 1. **VideoUploader Component** (`/src/components/admin/VideoUploader.tsx`)
Un composant React qui permet l'upload de vidéos vers Cloudinary directement depuis HomeEditor.

**Caractéristiques:**
- Upload de fichiers vidéo depuis la machine locale
- Validation du type de fichier (vidéo uniquement)
- Limite de taille: 100MB max
- Feedback utilisateur (statut, erreurs, succès)
- Prévisualisation de la vidéo uploadée
- Affichage de l'URL Cloudinary générée

**Usage:**
```tsx
<VideoUploader
  value={videoUrl}
  onChange={(url) => setVideoUrl(url)}
  label="Télécharger une vidéo"
/>
```

### 2. **VideoPlayer Component** (`/src/components/VideoPlayer.tsx`)
Composant pour afficher les vidéos Cloudinary avec un bouton play interactif.

**Caractéristiques:**
- Modal vidéo au clic du bouton play
- Bouton play stylisé avec effet hover
- Affichage en plein écran
- Fermeture simple (clic sur X ou en dehors)
- Responsive (mobile, tablette, desktop)
- Tailles de bouton play configurable (small, medium, large)

**Usage:**
```tsx
<VideoPlayer
  videoUrl={cloudinaryVideoUrl}
  posterImage={backgroundImage}
  playButtonSize="medium"
/>
```

### 3. **Mise à Jour des Types** (`/src/types/home.types.ts`)
Ajout du champ `videoUrl: string` à :
- `IWelcomeSection`
- `IVideoSection`

### 4. **Intégration dans HomeEditor**
Les deux sections permettent maintenant d'uploader des vidéos via le composant `VideoUploader`:

**Welcome Section:**
- Champ: "Vidéo Cloudinary"
- La vidéo remplace l'image de fond (avec effet hover et bouton play)

**Video Section:**
- Champ: "Vidéo Cloudinary"
- La vidéo s'affiche comme image principale avec overlay play

### 5. **Intégration dans Index.tsx (Public)**
Les vidéos Cloudinary sont affichées avec le composant `VideoPlayer`:

**Welcome Section:**
- Sur mobile: vidéo en haut avec bouton play
- Sur desktop: vidéo à gauche avec bouton play
- Le background image (videoImage) reste visible

**Video Section:**
- Main image: vidéo avec bouton play overlay
- Au clic: modal plein écran avec lecteur vidéo
- Galerie d'images préservée à côté

## 🚀 Comment Utiliser

### Étape 1: Accédez à HomeEditor
1. Allez à `/admin/home-editor`
2. Sélectionnez la section (Welcome ou Video)

### Étape 2: Uploadez une Vidéo
1. Cliquez sur "Télécharger vidéo"
2. Sélectionnez un fichier vidéo (MP4, WebM, etc.)
3. Attendez le succès de l'upload
4. L'URL Cloudinary est générée automatiquement

### Étape 3: Sauvegardez
1. Cliquez sur "Sauvegarder" en haut
2. La vidéo est sauvegardée dans la base de données

### Étape 4: Vérifiez le Rendu Public
1. Visitez la page d'accueil publique
2. Cliquez sur l'icône play pour lancer la vidéo
3. La vidéo s'affiche en modal plein écran avec contrôles

## 🔧 Configuration Cloudinary

### Upload Preset
L'upload preset Cloudinary utilisé est: `hero_showcase_videos`

Pour modifier ou créer un nouvel upload preset:
1. Allez sur https://cloudinary.com/console
2. Accédez à Settings > Upload
3. Configurez l'upload preset selon vos besoins

### Variables d'Environnement
Les variables suivantes sont utilisées:
```env
VITE_CLOUDINARY_CLOUD_NAME=dz62ihibb (ou votre nom)
VITE_CLOUDINARY_UPLOAD_PRESET=hero_showcase_videos
```

## 📸 Comportement de Fallback

Le système détecte automatiquement le type de vidéo:
- **Cloudinary**: Affichée avec `VideoPlayer` (modal avec play button)
- **YouTube**: Conserve l'ancien comportement avec `VideoModal`

Si aucune vidéo n'est uploadée, les images de fond restent visibles (graceful degradation).

## 🎨 Personnalisation

### Tailles du Bouton Play
Dans `VideoPlayer`:
```tsx
playButtonSize="small"   // 40-50px
playButtonSize="medium"  // 56-80px (défaut)
playButtonSize="large"   // 64-96px
```

### Couleurs
- Couleur du bouton au hover: `#FF1B7C` (rose)
- Bordure blanche avec backdrop blur

## 📱 Responsive Design
- **Mobile**: Vidéo plein écran, bouton play centré
- **Tablette**: Vidéo responsive avec aspect ratio préservé
- **Desktop**: Comportement d'origine avec intégration vidéo

## ✅ Checklist de Validation

- [ ] VideoUploader accepte les fichiers vidéo
- [ ] Feedback utilisateur visible pendant l'upload
- [ ] URL Cloudinary générée et affichée
- [ ] Prévisualisation vidéo fonctionnelle
- [ ] Sauvegarde dans HomeEditor fonctionne
- [ ] VideoPlayer affiche la vidéo en modal
- [ ] Bouton play visible et interactif
- [ ] Modal plein écran avec contrôles vidéo
- [ ] Fermeture modal au clic sur X
- [ ] Responsive design sur tous les écrans
- [ ] Images de fond visibles en fallback
- [ ] Pas d'erreurs console

## 🐛 Dépannage

### L'upload échoue
- Vérifiez la taille du fichier (< 100MB)
- Assurez-vous que c'est un fichier vidéo valide
- Vérifiez votre connexion internet
- Vérifiez les paramètres Cloudinary dans .env

### La vidéo ne s'affiche pas publiquement
- Vérifiez que l'URL Cloudinary est sauvegardée
- Rafraîchissez la page
- Vérifiez la console pour les erreurs
- Assurez-vous que l'URL n'est pas vide

### Le bouton play ne s'affiche pas
- Vérifiez que le composant `VideoPlayer` est importé
- Assurez-vous que `isCloudinaryVideo` est vrai
- Vérifiez que la classe CSS est appliquée correctement

## 📚 Fichiers Modifiés/Créés

```
src/
├── components/
│   ├── admin/
│   │   └── VideoUploader.tsx (NOUVEAU)
│   └── VideoPlayer.tsx (NOUVEAU)
├── pages/
│   ├── Admin/
│   │   └── HomeEditor.tsx (MODIFIÉ - ajout VideoUploader)
│   └── Index.tsx (MODIFIÉ - intégration VideoPlayer)
└── types/
    └── home.types.ts (MODIFIÉ - ajout videoUrl)
```

## 🔐 Notes de Sécurité

- Les uploads sont validés côté client
- Seules les vidéos sont acceptées
- Cloudinary gère la sécurité des fichiers côté serveur
- Les URLs Cloudinary sont publiques par défaut

## 📞 Support

Pour toute question ou problème, consultez:
1. La documentation Cloudinary: https://cloudinary.com/documentation
2. Les logs de la console du navigateur
3. Les logs serveur du backend
