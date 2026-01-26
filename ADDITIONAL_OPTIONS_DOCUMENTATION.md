# Module d'Options Supplémentaires - Documentation

## Vue d'ensemble

Le module d'options supplémentaires permet aux utilisateurs de personnaliser leur réservation en sélectionnant des services optionnels, des modifications de séjour, des assurances et des commodités.

## Structure de l'application

### Backend

#### Modèle de données
- **AdditionalOption** (`backend/src/models/AdditionalOption.ts`)
  - Stocke les informations sur chaque option disponible
  - Champs: `name`, `description`, `category`, `price`, `pricingType`, `icon`, `isActive`
  - Catégories: `service`, `modification`, `insurance`, `commodity`
  - Types de prix: `fixed` (prix unique), `per_day` (par nuit), `per_guest` (par personne)

#### Contrôleur
- **OptionController** (`backend/src/controllers/option.controller.ts`)
  - `getAllOptions()` - Récupère toutes les options actives (groupées par catégorie)
  - `getOptionsByCategory(category)` - Filtre par catégorie
  - `getOption(id)` - Récupère une option spécifique
  - `createOption()` - Crée une option (admin)
  - `updateOption(id)` - Met à jour une option (admin)
  - `deleteOption(id)` - Supprime une option (admin)

#### Routes
- **options.routes.ts** (`backend/src/routes/options.routes.ts`)
  - `GET /api/options` - Récupère toutes les options
  - `GET /api/options/category/:category` - Filtre par catégorie
  - `GET /api/options/:id` - Détails d'une option
  - `POST /api/options` - Crée une option (requires admin auth)
  - `PUT /api/options/:id` - Met à jour une option (requires admin auth)
  - `DELETE /api/options/:id` - Supprime une option (requires admin auth)

#### Seeds
- **seed-options.ts** (`backend/src/seeds/seed-options.ts`)
  - Insère 14 options par défaut en base de données
  - Commande: `npm run seed`
  - Options par catégorie:
    - Services (4): Nettoyage, Draps Premium, Parking, WiFi
    - Modifications (3): Check-in Anticipé, Check-out Tardif, Horaires Flexibles
    - Assurances (3): Annulation, Dégâts, Responsabilité
    - Commodités (4): Petit-déjeuner, Dîner, Pique-nique, Conciergerie

### Frontend

#### Composants

**AdditionalOptionsSelector** (`src/components/reservation/AdditionalOptionsSelector.tsx`)
- Affiche les options disponibles organisées par catégorie
- Permet la sélection/désélection d'options
- Calcule automatiquement les prix selon le type (fixed/per_day/per_guest)
- Affiche le total des options sélectionnées
- Props:
  - `nights: number` - Nombre de nuits de séjour
  - `guests: number` - Nombre de personnes
  - `selectedOptions: SelectedOption[]` - Options actuellement sélectionnées
  - `onOptionsChange: (options) => void` - Callback lors de changement
  - `onPriceChange: (price) => void` - Callback pour le prix total

**AppartmentDetail** (`src/components/appartmentDetail/AppartmentDetail.tsx`)
- Intègre le sélecteur d'options
- Passe les données de réservation (nights, guests, options)
- Met à jour le prix total en fonction des options sélectionnées

**PaymentForm** (`src/components/payment/PaymentForm.tsx`)
- Accepte les options sélectionnées et leur prix total
- Envoie les détails des options au serveur lors du paiement
- Inclut les options dans la requête de création de paiement

#### Services API
- **api.ts** (`src/services/api.ts`)
  - `getAdditionalOptions()` - Récupère toutes les options
  - `getOptionsByCategory(category)` - Filtre par catégorie
  - `getOption(id)` - Détails d'une option
  - `createOption(data)` - Crée une option (admin)
  - `updateOption(id, data)` - Met à jour une option (admin)
  - `deleteOption(id)` - Supprime une option (admin)

### Modèles de base de données

**Reservation** (mis à jour)
```typescript
additionalOptions: [{
  optionId: ObjectId,
  name: string,
  price: number,
  quantity: number
}]
additionalOptionsPrice: number
```

## Flux d'utilisation

1. **Sélection des options**
   - L'utilisateur navigue vers la page de détail d'un appartement
   - Le composant `AdditionalOptionsSelector` charge les options disponibles via l'API
   - L'utilisateur sélectionne les options désirées
   - Les prix sont calculés en temps réel selon le type de tarification

2. **Préparation de la réservation**
   - Les données de réservation incluent maintenant les options sélectionnées
   - Le prix total est recalculé (prix de base + prix des options)

3. **Paiement**
   - Le formulaire de paiement reçoit les détails des options
   - Les informations d'options sont envoyées au backend
   - La réservation est sauvegardée avec les options sélectionnées

4. **Confirmation**
   - La page de succès affiche le détail complet y compris les options

## Calcul des prix

Les options supportent trois types de tarification:

1. **Fixed**: Prix unique, indépendant de la durée ou du nombre de personnes
   - Exemple: Nettoyage 75€, WiFi 20€

2. **Per Day**: Prix multiplié par le nombre de nuits
   - Exemple: Parking 15€/nuit → 75€ pour 5 nuits

3. **Per Guest**: Prix multiplié par le nombre de personnes
   - Exemple: Petit-déjeuner 15€/personne → 60€ pour 4 personnes

## Configuration par défaut

Les 14 options suivantes sont créées lors du seed:

### Services (4)
- 🧹 Nettoyage - 75€ (fixed)
- 🛏️ Draps Premium - 30€ (fixed)
- 🅿️ Parking Couvert - 15€/nuit (per_day)
- 📡 WiFi Premium - 20€ (fixed)

### Modifications (3)
- 🔑 Check-in Anticipé - 25€ (fixed)
- 🕐 Check-out Tardif - 25€ (fixed)
- ⏰ Horaires Flexibles - 50€ (fixed)

### Assurances (3)
- 🛡️ Assurance Annulation - 75€ (fixed)
- ⚠️ Protection Dégâts - 50€ (fixed)
- 📋 Responsabilité Civile - 40€ (fixed)

### Commodités (4)
- 🥐 Petit-déjeuner - 15€/nuit (per_day)
- 🍽️ Dîner à Domicile - 40€/nuit (per_day)
- 🧺 Panier Pique-nique - 25€ (fixed)
- 🎩 Service Conciergerie - 35€ (fixed)

## Installation et initialisation

### 1. Installation des dépendances
```bash
cd backend
npm install
```

### 2. Configuration de l'environnement
Assurez-vous que `MONGODB_URI` est configuré dans `.env`

### 3. Remplissage de la base de données
```bash
npm run seed
```

### 4. Démarrage du serveur
```bash
npm run dev
```

## Testing

### Test du flux complet
1. Ouvrir le navigateur sur http://localhost:8081
2. Naviguer vers la page de détail d'un appartement
3. Observer le sélecteur d'options chargé
4. Sélectionner plusieurs options
5. Vérifier que le prix total se met à jour
6. Continuer vers le paiement
7. Vérifier que les options sont incluses dans la réservation

### Test des types de tarification
- **Per Day**: Changer le nombre de nuits et vérifier le calcul
- **Per Guest**: Changer le nombre de personnes et vérifier le calcul
- **Fixed**: Vérifier que le prix reste constant indépendamment

## Évolutions futures

- Gestion des stocks/disponibilités par option
- Dépendances entre options (ex: parking requis si voiture)
- Options en fonction de la saison
- Statistiques de popularité des options
- Interface d'admin pour gérer les options
- Envoi du détail des options dans les emails de confirmation
