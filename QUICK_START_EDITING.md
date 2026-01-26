# 🚀 Quick Start - Édition des Détails de Chambre

## ⚡ Démarrage rapide (5 minutes)

### 1️⃣ Accéder à l'éditeur
```
AppartmentEditor → Section "Rooms" (Chambres)
                 → Cliquer sur une chambre
                 → Section "Room Detail" s'active
```

### 2️⃣ Onglet "👀 Info Hero" (Bleu)
**Gérez ce qui s'affiche sur la page d'accueil:**

```
┌─────────────────────────────────────┐
│  Titre (Hero)                       │
│  → "Suite Royale"                   │
├─────────────────────────────────────┤
│  Sous-titre (Hero)                  │
│  → "Luxueuse suite avec balcon"     │
├─────────────────────────────────────┤
│  Type de logement                   │
│  → "Logement sans fumeur"           │
├─────────────────────────────────────┤
│  Description complète               │
│  → Paragraphe détaillé...           │
├─────────────────────────────────────┤
│  Images du Hero                     │
│  ┌─────────────────┐                │
│  │   Aperçu        │ [← Préc] [Sui→]│
│  │  1 / 3 images  │                │
│  └─────────────────┘                │
│                                     │
│  📤 Télécharger images              │
│  [#1] [#2] [#3] [+ Ajouter]        │
└─────────────────────────────────────┘
```

**Actions:**
- Télécharger 1+ images à la fois
- Naviguer avec flèches ou cliquer miniatures
- Supprimer en cliquant la corbeille
- Ajouter URLs externes

### 3️⃣ Onglet "Détails" (Standard)
**Gérez la tarification, capacité, équipements:**

```
┌─ 💰 Tarification ─────────────────────┐
│  Prix/nuit: 150€                      │
│  Invités: jusqu'à 4 invités          │
│  Chambres: 2 chambres                 │
└───────────────────────────────────────┘

┌─ ✅ Équipements inclus ────────────────┐
│  ☑ Thé et café                        │
│  ☑ Serviettes premium                 │
│  ☑ Savon bio                          │
│  [+ Ajouter]                          │
└───────────────────────────────────────┘

┌─ 🛡️ Équipements et services ───────────┐
│  ☑ WiFi gratuit                       │
│  ☑ Parking sécurisé                   │
│  ☑ Climatisation                      │
│  [+ Ajouter]                          │
└───────────────────────────────────────┘

┌─ ⭐ Caractéristiques principales ─────┐
│  ☑ Vue panoramique                    │
│  ☑ Balcon privé                       │
│  ☑ Baignoire spa                      │
│  [+ Ajouter]                          │
└───────────────────────────────────────┘
```

### 4️⃣ Sauvegarder
```
[💾 Sauvegarder] → Validation + Sauvegarde directe
[🔄 Synchroniser] → Brouillon local + Sync
[← Retour]
```

---

## 💡 Cas d'usage courants

### Cas 1️⃣: Ajouter une nouvelle chambre
```
1. Cliquer "Nouvelle chambre" en bas de la liste
2. Remplir le formulaire de base
3. Cliquer sur la chambre pour ouvrir les détails
4. Remplir onglet "Info Hero" avec images
5. Remplir onglet "Détails"
6. Sauvegarder
```

### Cas 2️⃣: Modifier le prix et la capacité
```
1. Ouvrir la chambre
2. Onglet "Détails"
3. Modifier les 3 champs:
   - Prix/nuit (€)
   - Invités
   - Chambres
4. Cliquer "Sauvegarder"
```

### Cas 3️⃣: Ajouter des images
```
1. Ouvrir la chambre
2. Onglet "👀 Info Hero"
3. Défiler jusqu'à "Images du Hero"
4. Cliquer zone "📤 Télécharger images"
5. Sélectionner 1+ fichiers
6. Voir progress et confirmation
7. Sauvegarder quand prêt
```

### Cas 4️⃣: Modifier équipements après fermeture
```
1. Ouvrir la chambre
2. Onglet "Détails"
3. Modifier équipements
4. Changements sauvegardés localement
5. NE PAS sauvegarder = brouillon
6. Rouvrir plus tard = brouillon récupéré
7. Cliquer "Synchroniser" pour envoyer au serveur
```

---

## 🎯 API - Exemples rapides

### Modifier tout d'un coup
```typescript
// Modifier informations hero uniquement
await roomDetailApi.updateHeroInfo(roomId, {
  title: 'Nouvelle Suite',
  subtitle: 'Description...',
  description: 'Texte complet...',
  accommodationType: 'Logement sans fumeur',
  images: ['url1', 'url2']
});
```

### Gérer prix et capacité
```typescript
// Modifier prix
await roomDetailApi.updatePricing(roomId, { price: 200 });

// Modifier invités/chambres
await roomDetailApi.updateGuestBedInfo(roomId, {
  guests: 'jusqu\'à 6 invités',
  bedrooms: '3 chambres'
});
```

### Gérer images
```typescript
// Ajouter une image
await roomDetailApi.addImage(roomId, 'https://...');

// Supprimer une image
await roomDetailApi.removeImage(roomId, 'https://...');

// Réorganiser
await roomDetailApi.reorderImages(roomId, ['url2', 'url1', 'url3']);
```

### Gérer équipements
```typescript
// Ajouter équipement
await roomDetailApi.addAmenity(roomId, 'Draps haut de gamme');

// Supprimer
await roomDetailApi.removeAmenity(roomId, 'Draps haut de gamme');

// Remplacer tous
await roomDetailApi.updateAmenities(roomId, ['WiFi', 'Parking']);
```

### Gérer brouillons
```typescript
// Sauvegarder localement
await roomDetailApi.saveLocalDraft(roomId, roomData);

// Récupérer brouillon
const draft = roomDetailApi.getLocalChanges(roomId);

// Synchroniser avec serveur
await roomDetailApi.syncLocalChanges(roomId);
```

---

## ✅ Checklist d'utilisation

### Avant de sauvegarder
- [ ] Images téléchargées (format valide)
- [ ] Prix > 0
- [ ] Titre rempli
- [ ] Description remplie
- [ ] Au moins une image

### Après modification
- [ ] Cliquer "Sauvegarder" ou "Synchroniser"
- [ ] Attendre le message de confirmation
- [ ] Vérifier aucune erreur rouge

### Vérification client
- [ ] Ouvrir AppartmentDetail avec le bon ID
- [ ] Vérifier titre et images
- [ ] Vérifier prix affiché
- [ ] Vérifier équipements listés

---

## 🎨 Couleur des sections

| Couleur | Signification | Contient |
|---------|---------------|----------|
| 🔵 Bleu | Information Hero | Titre, sous-titre, description, images |
| 🟡 Jaune | Tarification | Prix, invités, chambres |
| 🟢 Vert | Inclusions | Équipements gratuits |
| 🟣 Violet | Services | Équipements supplémentaires |
| 🟠 Orange | Caractéristiques | Points forts |

---

## 🐛 Si ça ne marche pas...

### Images ne s'affichent pas
→ Vérifier que l'URL commence par `/uploads/`

### Changements non sauvegardés
→ Vérifier la connexion backend (`localhost:3000` accessible)

### Erreur de validation
→ Lire le message d'erreur en rouge
→ Corriger le champ mentionné

### Les données ne s'affichent pas en client
→ Vérifier roomId correct dans l'URL
→ Rafraîchir la page

---

## 📱 Format des données

```typescript
// Structure d'une chambre complète
{
  roomId: 1,
  title: "Suite Royale",
  subtitle: "Luxueuse suite...",
  description: "Description détaillée...",
  price: 150,
  guests: "jusqu'à 4 invités",
  bedrooms: "2 chambres",
  accommodationType: "Logement sans fumeur",
  
  // Tableaux
  images: [
    "/uploads/room-1.jpg",
    "/uploads/room-2.jpg"
  ],
  features: ["Vue", "Balcon"],
  includes: ["Thé", "Café"],
  amenities: ["WiFi", "Parking"],
  
  // Métadonnées
  meta: {
    createdAt: "2024-01-26",
    updatedAt: "2024-01-26",
    updatedBy: "admin",
    version: 1
  }
}
```

---

## 🔐 Notes de sécurité

- ✅ Authentification requise pour édition
- ✅ Validation serveur des données
- ✅ Fichiers images vérifiés
- ✅ Brouillons locaux (localStorage) non sensibles
- ✅ Sync automatique quand connecté

---

## 📞 Support rapide

| Problème | Solution |
|----------|----------|
| Impossible de charger | Vérifier roomId dans l'URL |
| Erreur "Impossible de sauvegarder" | Vérifier connexion backend |
| Image floutée | Attendre le chargement complet |
| Changement pas visible | Rafraîchir la page (F5) |

---

**Dernière mise à jour:** 26 Janvier 2026  
**Prêt pour:** Production  
**Aucune erreur:** ✅
