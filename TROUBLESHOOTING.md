# 🔧 Troubleshooting - Solutions aux Problèmes Courants

## 🎯 Objectif
Chaque problème de recherche est lié à un endroit spécifique du code. Ce guide vous aide à les résoudre.

---

## 📋 Problème #1: 0 Résultats, Mais Il Devrait Y En Avoir

### Symptômes
```
📊 RÉSULTAT API: 0 appartement(s) trouvé(s)
```

Mais vous savez que la BD contient des appartements à "Lyon".

### Causes Possibles

#### 1️⃣ Casse Sensible
**Problème:** Vous cherchez "Lyon", mais en BD c'est "lyon" (minuscule)

**Vérification:**
```
🔎 Filtrage par destination: "lyon"
  ✅ Résultats après filtrage destination: 0 appartements
  
La destination reçue: "Lyon" (capitale)
La destination en BD: "lyon" (minuscule)
```

**Solution:** Ajouter `.toLowerCase()` lors du filtrage
```typescript
// AVANT (casse sensible)
const destination = searchParams.destination.toLowerCase().trim();

// APRÈS (normalisé)
const destination = searchParams.destination.toLowerCase().trim();
```

#### 2️⃣ Espaces Supplémentaires
**Problème:** Vous cherchez " Lyon " (avec espaces), en BD c'est "Lyon"

**Solution:**
```typescript
const destination = searchParams.destination.trim().toLowerCase();
```

#### 3️⃣ Mauvais Champ en BD
**Problème:** Vous cherchez dans `city`, mais le champ est `location` ou `address`

**Vérification:**
```typescript
// Le code filtre sur 4 champs:
const match = title.includes(destination) || 
              city.includes(destination) || 
              country.includes(destination) ||
              location.includes(destination);

// Vérifier que la BD a ces champs remplis:
console.log('Chambre 1:', { title, city, country, location })
```

**Solution:** Ajouter d'autres champs de recherche
```typescript
const match = title.includes(destination) || 
              city.includes(destination) || 
              country.includes(destination) ||
              location.includes(destination) ||
              address.includes(destination) || // ← Ajouter si nécessaire
              neighborhood.includes(destination);
```

#### 4️⃣ Problème de Format de Date
**Problème:** La date `checkIn` n'est pas au bon format

**Vérification:**
```
📅 CheckIn: 2026-02-12
```

Doit être au format `YYYY-MM-DD`

**Solution:**
```typescript
// Vérifier que la date est formatée correctement
const checkInDate = new Date(searchParams.checkIn);
if (isNaN(checkInDate.getTime())) {
  console.error('❌ Date invalide:', searchParams.checkIn);
  // Reformater
}
```

#### 5️⃣ Backend N'Applique Pas le Filtre
**Problème:** L'API reçoit les paramètres, mais ne les utilise pas

**Vérification des logs backend:**
```
GET /api/search/?destination=Lyon&checkIn=2026-02-12&travelers=3
Response: {apartments: [...all apartments, not filtered...]}
```

**Solution:** Vérifier le code du backend
```javascript
// BACKEND: src/routes/search.js (exemple)

// ❌ MAUVAIS (retourne tous les appartements)
router.get('/', (req, res) => {
  const apartments = Apartment.find(); // Pas de filtres!
  res.json({ apartments });
});

// ✅ BON (applique les filtres)
router.get('/', (req, res) => {
  const { destination, checkIn, travelers } = req.query;
  const filters = {};
  if (destination) filters.city = destination.toLowerCase();
  if (travelers) filters.capacity = { $gte: parseInt(travelers) };
  
  const apartments = Apartment.find(filters);
  res.json({ apartments });
});
```

---

## 🌐 Problème #2: Erreur HTTP 500

### Symptômes
```
📡 Status: 500 Internal Server Error
❌ Erreur lors de la recherche: Error: Erreur HTTP 500
```

### Causes Possibles

#### 1️⃣ Erreur de Syntaxe en Backend
**Solution:**
- Vérifier les logs de la console serveur
- Chercher les lignes rouges d'erreur

#### 2️⃣ Erreur de Connexion à la BD
**Logs typiques:**
```
Error: ECONNREFUSED 127.0.0.1:27017
MongooseError: Cannot connect to MongoDB
```

**Solution:**
- Vérifier que MongoDB est en cours d'exécution
- Vérifier la connection string
- Vérifier les credentials

#### 3️⃣ Query MongoDB Invalide
**Logs typiques:**
```
CastError: Cast to ObjectId failed for value "Lyon"
```

**Solution:** Vérifier les types de données
```typescript
// ❌ MAUVAIS
const filters = {
  capacity: parseInt(travelers) // Le champ ne peut pas être chaîne
};

// ✅ BON
const filters = {
  capacity: { $gte: parseInt(travelers) } // Opérateur MongoDB
};
```

---

## 🔴 Problème #3: Affiche 0, Mais API Retourne 5

### Symptômes
```
✅ Réponse API reçue: {apartments: Array(5), ...}
  📦 Nombre d'appartements retournés: 5
  
(mais l'écran montre "Aucun résultat")
```

### Causes

#### 1️⃣ `setFilteredRooms()` n'a pas été appelé
**Vérification:**
```typescript
// AVANT
const transformedRooms = response.apartments.map(...);
// Pas de setFilteredRooms() ici!

// APRÈS
const transformedRooms = response.apartments.map(...);
setFilteredRooms(transformedRooms); // ← AJOUTER
```

#### 2️⃣ Les données ne sont pas passées au composant
**Vérification:**
```tsx
// ❌ MAUVAIS
<RoomsSection 
  data={pageData.roomsSection} 
  // filteredRooms pas passé!
/>

// ✅ BON
<RoomsSection 
  data={pageData.roomsSection} 
  filteredRooms={filteredRooms} ← AJOUTER
  searchParams={searchParams}
/>
```

#### 3️⃣ Le composant n'utilise pas `filteredRooms`
**Vérification dans RoomsSection:**
```typescript
// ❌ MAUVAIS
const allRooms = data?.rooms || []; // Ignore filteredRooms!

// ✅ BON
const allRooms = hasSearchParams ? filteredRooms : (data?.rooms || []);
```

---

## 🎯 Problème #4: Dates Ne Correspondent Pas

### Symptômes
```
Vous cherchez: 2026-02-12
API retourne: 0 appartements
Mais l'apparement a availableFrom: 2026-02-12
```

### Vérifications

#### 1️⃣ Format de Date Différent
```
❌ Frontend: 2026-02-12
❌ BD: 2026/02/12 ou 02-12-2026
```

**Solution:** Normaliser le format
```typescript
// Convertir tous les formats au format ISO
const normalizeDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};
```

#### 2️⃣ Comparaison de Dates Incorrecte
```typescript
// ❌ MAUVAIS (comparaison chaîne)
if (searchParams.checkIn >= room.availableFrom) // Comparaison texte!

// ✅ BON (comparaison Date)
const checkIn = new Date(searchParams.checkIn);
const available = new Date(room.availableFrom);
if (checkIn >= available) // Comparaison Date
```

#### 3️⃣ Timezone Différente
```javascript
// Backend peut donner: 2026-02-12T00:00:00Z (UTC)
// Frontend voir: 2026-02-11 (jour précédent selon timezone)

// Solution: Toujours utiliser UTC
```

---

## 👥 Problème #5: Filtrage par Voyageurs Ne Marche Pas

### Symptômes
```
👥 Voyageurs: 3
Vous cherchez un appart pour 6 personnes
L'API retourne: 0 résultats
```

### Causes

#### 1️⃣ Format Incorrect du Nombre
```
// ❌ MAUVAIS
travelers: '6' // Chaîne au lieu d'un nombre

// ✅ BON
travelers: 6 // Nombre
```

**Vérification:**
```typescript
// Dans le code
parseInt(searchParams.travelers, 10) // Convertir en nombre
```

#### 2️⃣ Champ Capacity Vide en BD
```
Appart avec: capacity: undefined
Recherche avec: travelers: 3
Résultat: Ne correspond pas
```

**Solution:** Ajouter des valeurs par défaut
```typescript
const guestCount = room.capacity !== undefined ? room.capacity : extractNumber(room.guests);
```

#### 3️⃣ Opérateur de Comparaison Inverse
```typescript
// ❌ MAUVAIS
return guestCount <= requiredTravelers; // Plus petit ou égal!

// ✅ BON
return guestCount >= requiredTravelers; // Plus grand ou égal
```

---

## 🔗 Problème #6: API N'Est Pas Appelée du Tout

### Symptômes
```
🌐 APPEL API RECHERCHE (ce log n'apparait PAS)
```

Vous effectuez une recherche mais l'API n'est jamais appelée.

### Causes

#### 1️⃣ `pageData` est `null`
```typescript
// ❌ MAUVAIS
if (!pageData) return; // Sort de la fonction!

// ✅ BON
if (!pageData) return; // Normal, mais ensuite:
// Vérifier que pageData se charge bien
console.log('pageData:', pageData);
```

**Vérification:**
- Les données de la page sont-elles chargées?
- Le loading state est-il fini?

#### 2️⃣ `searchParams` n'est pas reçu
```
URL: /appartement (sans paramètres)
VS
URL: /appartement?destination=Lyon (avec paramètres)
```

**Solution:** Vérifier que le lien d'accès contient les paramètres
```typescript
// Sur la page d'accueil:
navigate(`/appartement?destination=${dest}&checkIn=${date}&travelers=${count}`);
```

#### 3️⃣ `useEffect` ne se déclenche pas
```typescript
// ❌ MAUVAIS (oubli de dépendance)
useEffect(() => {
  filterRooms();
}, []); // Dépendances vides!

// ✅ BON
useEffect(() => {
  filterRooms();
}, [pageData, searchParams]); // Bonnes dépendances
```

---

## 📱 Problème #7: Résultats Affichés Mais Vides

### Symptômes
```
✅ 5 appartements transformés
Mais l'écran montre: "Aucun résultat"
```

### Causes

#### 1️⃣ Les objets `room` ne se chargent pas bien
```typescript
// ❌ MAUVAIS
{visibleRooms.map((room) => (
  <div key={room.id}> {/* room.id est undefined! */}
    {room.title} {/* undefined */}
  </div>
))}

// ✅ BON
{visibleRooms.map((room, index) => (
  <div key={room.id || index}>
    {room?.title || 'Sans titre'}
  </div>
))}
```

#### 2️⃣ Images ne se chargent pas
```
Les cards s'affichent mais sans images
```

**Vérification:**
- Les URLs d'images sont-elles valides?
- Les images proviennent de Cloudinary ou du serveur?

---

## ✅ Checklist de Resolution

Quand vous avez un problème, suivez cette checklist:

### 1. Vérifier les Logs
- [ ] Console frontend ouvre (F12)
- [ ] Logs montrent les paramètres reçus
- [ ] Logs montrent l'URL d'API appelée
- [ ] Status HTTP visible (200 ou 500)

### 2. Vérifier les Données
- [ ] `response.apartments` est un Array
- [ ] Chaque apartment a un `id` unique
- [ ] Les champs `title`, `city` sont remplis
- [ ] Les images ont des URLs valides

### 3. Vérifier la Logique
- [ ] `setFilteredRooms()` est appelé
- [ ] `filteredRooms` est passé au composant
- [ ] Le composant utilise `filteredRooms` au lieu de `data.rooms`
- [ ] Pas d'erreur dans la console

### 4. Tester l'API Directement
- [ ] Ouvrir l'URL dans un nouvel onglet
- [ ] Vérifier la réponse JSON brute
- [ ] Chercher les erreurs d'API

### 5. Vérifier le Backend
- [ ] Logs du serveur montrent la requête
- [ ] BD contient les données attendues
- [ ] Filtres sont appliqués correctement

---

## 🔗 Ressources Utiles

| Lien | But |
|------|-----|
| `https://airbnb-backend-l640.onrender.com/api/search/?destination=Lyon` | Tester l'API directement |
| DevTools (F12) → Console | Voir les logs |
| DevTools → Network | Voir les requêtes HTTP |
| MongoDB Compass | Vérifier les données |

---

## 💡 Last Resort (Dernier Recours)

Si rien ne fonctionne:

1. **Vider le cache:**
   ```
   DevTools → Application → Storage → Clear all
   ```

2. **Redémarrer le serveur:**
   ```
   Backend: Clic droit → Restart
   Frontend: npm run dev
   ```

3. **Vérifier les logs complets:**
   ```
   Copier TOUS les logs
   Les envoyer au support
   ```

4. **Tester un cas simple:**
   - Destination existant (Paris, Londre)
   - Date quelconque
   - 1 voyageur
   - Voir si au moins un résultat

