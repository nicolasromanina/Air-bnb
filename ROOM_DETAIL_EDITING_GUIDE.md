# 📝 Guide Complet: Édition des Détails de Chambre

## 🎯 Vue d'ensemble

Les fonctionnalités complètes de modification des détails de chambre ont été intégrées dans:
1. **[AppartmentEditor.tsx](src/pages/Admin/AppartmentEditor.tsx)** - Interface d'administration
2. **[AppartmentDetail.tsx](src/components/appartmentDetail/AppartmentDetail.tsx)** - Affichage client
3. **[roomDetailApi.ts](src/services/roomDetailApi.ts)** - API client

---

## 🔧 Utilisation dans AppartmentEditor

### Accès à l'éditeur

1. Naviguez vers la section **Rooms** (Chambres)
2. Cliquez sur une chambre pour charger ses détails
3. La section **Room Detail** s'active automatiquement

### Onglets disponibles

#### 📌 Onglet "👀 Info Hero" (Bleu)
Gérez les informations qui s'affichent sur la page d'accueil:

- **Titre (Hero)** - Titre principal visible en gros sur la page
- **Sous-titre (Hero)** - Description courte pour la section héro
- **Type de logement** - Ex: "Logement sans fumeur", "Suite deluxe", etc.
- **Description complète** - Description détaillée du logement
- **Images du Hero** - Galerie d'images avec:
  - Aperçu avec navigation précédent/suivant
  - Téléchargement multiple d'images
  - Gestion des URLs externes
  - Suppression d'images individuelles

#### 💰 Onglet "Détails" (Standard)

**Section Tarification et Capacité** (Fond jaune):
- 💰 **Prix par nuit (€)** - Montant en euros
- 👥 **Nombre d'invités** - Ex: "jusqu'à 4 invités"
- 🛏️ **Nombre de chambres** - Ex: "2 chambres"

**Section Équipements inclus** (Fond vert):
- Gérez les équipements fournis
- Ex: Thé, café, serviettes, etc.
- Ajoutez/supprimez à volonté

**Section Équipements et services** (Fond violet):
- Équipements supplémentaires
- Ex: Parking sécurisé, WiFi, Climatisation
- Services premium inclus

**Section Caractéristiques principales** (Fond orange):
- Points forts du logement
- Ex: "Vue panoramique", "Balcon privé"
- Affichés avec des icônes de validation

---

## 📲 Utilisation dans AppartmentDetail (Affichage Client)

### Affichage automatique des informations enrichies

Le composant `AppartmentDetail` affiche automatiquement:

1. **Images du Hero**
   - Galerie complète avec miniatures
   - Navigation précédent/suivant
   - Compteur d'images

2. **Informations principales**
   - Titre et sous-titre enrichis
   - Badges: Nombre de personnes, chambres
   - Type de logement

3. **Informations générales**
   - Prix par nuit
   - Type de logement (si disponible)
   - Équipements inclus (affichés en rose)
   - Équipements et services

4. **Description détaillée**
   - Contenu formaté
   - Lisibilité optimisée

5. **Caractéristiques principales**
   - Liste avec checkmarks verts
   - Affichée avant les options supplémentaires

---

## 🔌 API Complète - roomDetailApi

### Fonctions de base

```typescript
// Récupérer une chambre
const response = await roomDetailApi.getRoomDetail(roomId);

// Mettre à jour complètement
await roomDetailApi.updateRoomDetail(roomId, data);

// Créer une nouvelle chambre
await roomDetailApi.createRoomDetail(roomId, data);

// Supprimer
await roomDetailApi.deleteRoomDetail(roomId);
```

### Fonctions spécialisées

#### 📸 Gestion des images

```typescript
// Mettre à jour toutes les images
await roomDetailApi.updateImages(roomId, ['url1', 'url2']);

// Ajouter une image
await roomDetailApi.addImage(roomId, 'https://...');

// Supprimer une image
await roomDetailApi.removeImage(roomId, 'https://...');

// Réorganiser l'ordre
await roomDetailApi.reorderImages(roomId, ['url2', 'url1']);

// Télécharger un fichier
const result = await roomDetailApi.uploadImage(file);
// Returns: { success: true, url: '/uploads/...', filename: '...' }
```

#### 💰 Gestion des prix

```typescript
await roomDetailApi.updatePricing(roomId, {
  price: 150,
  currency: 'EUR' // optionnel
});
```

#### 👥 Gestion des invités/chambres

```typescript
await roomDetailApi.updateGuestBedInfo(roomId, {
  guests: 'jusqu\'à 4 invités',
  bedrooms: '2 chambres'
});
```

#### 🎯 Gestion du Hero

```typescript
await roomDetailApi.updateHeroInfo(roomId, {
  title: 'Suite Royale',
  subtitle: 'Luxueuse suite...',
  description: 'Description...',
  accommodationType: 'Logement sans fumeur',
  images: ['url1', 'url2']
});
```

#### ✨ Gestion des équipements

```typescript
// Ajouter un équipement inclus
await roomDetailApi.addAmenity(roomId, 'WiFi gratuit');

// Supprimer
await roomDetailApi.removeAmenity(roomId, 'WiFi gratuit');

// Mettre à jour tous
await roomDetailApi.updateAmenities(roomId, ['WiFi', 'Parking']);
```

#### 📋 Gestion des inclusions

```typescript
await roomDetailApi.updateIncludes(roomId, [
  'Thé et café',
  'Serviettes',
  'Savon'
]);
```

#### 🌟 Gestion des caractéristiques

```typescript
// Ajouter une caractéristique
await roomDetailApi.addFeature(roomId, 'Vue panoramique');

// Supprimer
await roomDetailApi.removeFeature(roomId, 'Vue panoramique');

// Mettre à jour toutes
await roomDetailApi.updateFeatures(roomId, {
  features: ['Vue', 'Balcon'],
  includes: ['Thé'],
  amenities: ['WiFi']
});
```

### Fonctions de brouillon local

```typescript
// Sauvegarder un brouillon
await roomDetailApi.saveLocalDraft(roomId, data, version);

// Récupérer le timestamp
const timestamp = roomDetailApi.getLocalDraftTimestamp(roomId);

// Charger un brouillon
const draft = roomDetailApi.getLocalChanges(roomId);

// Récupérer tous les brouillons
const allDrafts = roomDetailApi.getAllLocalDrafts();

// Supprimer un brouillon
roomDetailApi.clearLocalDraft(roomId);

// Synchroniser avec le serveur
await roomDetailApi.syncLocalChanges(roomId);
```

### Validation

```typescript
const { valid, errors } = roomDetailApi.validateRoomDetail({
  title: 'New Title',
  price: 150,
  images: ['url1', 'url2']
});

if (!valid) {
  console.log('Erreurs:', errors);
  // ['Le prix ne peut pas être négatif', ...]
}
```

---

## 🎨 Interfaces TypeScript

```typescript
export interface RoomDetail {
  roomId: number;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  guests: string;
  bedrooms: string;
  images: string[];
  features: string[];
  accommodationType?: string;
  includes?: string[];
  amenities?: string[];
  selectedOptionIds?: string[];
  meta: {
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
    version: number;
  };
}

export interface HeroInfo {
  title: string;
  subtitle: string;
  description: string;
  accommodationType?: string;
  images: string[];
}

export interface PricingInfo {
  price: number;
  currency?: string;
}

export interface GuestBedInfo {
  guests: string;
  bedrooms: string;
}

export interface RoomFeatures {
  features: string[];
  includes?: string[];
  amenities?: string[];
}
```

---

## 🔄 Flux de travail recommandé

### Pour l'administrateur

1. **Ouvrir l'éditeur** → AppartmentEditor → Section Rooms
2. **Sélectionner une chambre** → Charge les détails
3. **Remplir les infos hero** (onglet bleu)
   - Télécharger les images
   - Remplir titre, sous-titre, description
   - Définir le type de logement
4. **Ajouter les détails** (onglet standard)
   - Prix, capacité
   - Équipements inclus
   - Services supplémentaires
   - Caractéristiques
5. **Sauvegarder**
   - Bouton vert "Sauvegarder" pour la sauvegarde directe
   - Bouton bleu "Synchroniser" pour le brouillon + sync

### Pour le client

1. **Consulter la chambre** → AppartmentDetail
2. **Voir les images** → Galerie avec navigation
3. **Lire les informations** → Affichées automatiquement
4. **Réserver** → Utiliser le formulaire de réservation

---

## 📊 Validation automatique

L'API valide automatiquement:

✅ Prix >= 0  
✅ Titre non vide  
✅ Description non vide  
✅ Images = tableau  
✅ Caractéristiques = tableau  

Les erreurs sont retournées dans le format:
```typescript
{
  valid: false,
  errors: ['Le prix ne peut pas être négatif', '...']
}
```

---

## 🚀 Bonnes pratiques

1. **Toujours valider** avant sauvegarde manuelle
2. **Utiliser les brouillons** pour les changements majeurs
3. **Télécharger les images** via le formulaire plutôt que URLs externes
4. **Sauvegarder régulièrement** avec le bouton "Sauvegarder"
5. **Synchroniser** les brouillons locaux avant de fermer le navigateur

---

## 🐛 Dépannage

### Images ne s'affichent pas
- Vérifier que l'URL commence par `/uploads/`
- Pour les URLs externes, vérifier l'accessibilité CORS

### Les changements ne sont pas sauvegardés
- Vérifier la connexion au backend
- Utiliser "Synchroniser" pour forcer la sync
- Vérifier les erreurs de validation

### Erreur "Impossible de charger les détails"
- Vérifier que la chambre existe (roomId valide)
- Vérifier la connexion backend sur `http://localhost:3000`

---

## 📚 Fichiers modifiés

- `src/services/roomDetailApi.ts` - Nouvelles fonctionnalités API
- `src/pages/Admin/AppartmentEditor.tsx` - Interface d'édition enrichie
- `src/components/appartmentDetail/AppartmentDetail.tsx` - Affichage amélioré

---

**Dernière mise à jour:** 26 Janvier 2026  
**Version:** 2.0 - Support complet de l'édition des détails
