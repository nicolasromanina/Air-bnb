# Guide de Debugging - Logs de Recherche Détaillés

## 📝 Résumé des Changements

Des logs détaillés ont été ajoutés au système de recherche pour déboguer pourquoi aucun appartement n'est trouvé.

## 🔍 Fichiers Modifiés

### 1. **src/pages/Appartment.tsx**
Ajout de logs détaillés dans le `useEffect` de filtrage:

```typescript
// ✅ Logs ajoutés:
console.log('📍 Destination:', searchParams.destination);
console.log('📅 CheckIn:', searchParams.checkIn);
console.log('👥 Voyageurs:', searchParams.travelers);
console.log(`📊 RÉSULTAT API: ${response.apartments.length} appartement(s) trouvé(s)`);
console.log('🏠 Détails des résultats:', response.apartments);
console.log('📌 Response complète:', response);
console.log('✅ Appartements transformés:', transformedRooms);
console.log('❌ Erreur lors de la recherche:', error);
console.log('📋 Stack trace:', error.stack);
console.log('📦 Rooms disponibles localement:', rooms.length, rooms);
console.log(`🔎 Filtrage par destination: "${destination}"`);
console.log(`✅ Résultats après filtrage destination: ${rooms.length} appartements`);
console.log(`🔎 Filtrage par nombre de voyageurs: ${requiredTravelers}`);
console.log(`✅ Résultats après filtrage voyageurs: ${rooms.length} appartements`);
console.log('🎯 Résultat final du fallback local:', rooms);
```

### 2. **src/services/searchApi.ts**
Ajout de logs exhaustifs pour le service API:

**Dans `searchApartments()`:**
```typescript
console.log('🌐 APPEL API RECHERCHE');
console.log('  📍 URL complète:', `${BACKEND_URL}${url}`);
console.log('  🔍 Filtres appliqués:', filters);
console.log('  📋 Query string:', queryString);
console.log('✅ Réponse API reçue:', response);
console.log(`  📦 Nombre d'appartements retournés: ${response.apartments.length}`);
console.log(`  📄 Pagination:`, response.pagination);
```

**Dans `makeRequest()`:**
```typescript
console.log(`📡 Requête ${method}: ${fullUrl}`);
console.log(`   Headers:`, headers);
console.log(`   Status: ${response.status} ${response.statusText}`);
console.log(`   Headers réponse:`, response.headers);
console.log(`✅ Réponse complète reçue pour ${method} ${url}`);
console.log(`❌ Erreur ${method} ${url}:`, error);
```

## 🎯 Informations de Debugging

Lorsque vous effectuez une recherche, ouvrez la console du navigateur (F12) et regardez:

### ✅ Flux de Recherche Normal
1. **Recherche initiée**: 
   - `🔍 Paramètres de recherche reçus: {destination: '...', checkIn: '...', travelers: '...'}`

2. **Appel API**:
   - `🌐 APPEL API RECHERCHE`
   - `📍 URL complète: https://airbnb-backend-l640.onrender.com/api/search/?...`
   - `📡 Requête GET: ...`
   - `✅ Réponse API reçue:`

3. **Résultats**:
   - `📊 RÉSULTAT API: X appartement(s) trouvé(s)`
   - `✅ Appartements transformés: [...]`

### ❌ Problème: 0 Résultat
Si vous voyez `📊 RÉSULTAT API: 0 appartement(s) trouvé(s)`, vérifiez:

1. **Les paramètres sont-ils corrects?**
   - `📍 Destination: Lyon`
   - `📅 CheckIn: 2026-02-12`
   - `👥 Voyageurs: 3`

2. **L'API répond-elle?**
   - Vérifiez le status HTTP (200, 400, 500?)
   - `Status: 200 OK` = API fonctionne
   - `Status: 500` = Erreur serveur

3. **La réponse est vide?**
   - `🏠 Détails des résultats: []` = Pas d'appartements correspondants
   - Vérifier les logs backend pour voir pourquoi

4. **Fallback activé?**
   - `⚠️ Fallback au filtrage local`
   - Cela signifie que l'API a échoué, on filtre les données locales
   - `📦 Rooms disponibles localement: X rooms`

## 🛠️ Dépannage Étape par Étape

### Cas 1: 0 résultat, mais il y en a en BD
```
❌ 📊 RÉSULTAT API: 0 appartement(s) trouvé(s)
```

**Vérifications à faire:**
1. Le backend filtre-t-il correctement? (voir les logs backend)
2. Les données de recherche sont-elles formatées correctement?
3. La destination "Lyon" existe-t-elle en BD avec cette casse?

### Cas 2: Erreur API
```
❌ Erreur lors de la recherche: Error: Erreur HTTP 500
📋 Stack trace: ...
```

**Le serveur backend a un problème:**
- Vérifier les logs du backend
- Vérifier la syntaxe de la requête API
- Vérifier la connexion à la BD

### Cas 3: Pas d'appel API du tout
```
🌐 APPEL API RECHERCHE (N'APPARAIT PAS)
```

**Le code ne rentre pas dans le `useEffect`:**
- Vérifier si `pageData` est null
- Vérifier si les `searchParams` sont bien parsés de l'URL

## 📊 Checklist de Debugging

- [ ] Ouvrir les DevTools (F12)
- [ ] Faire une recherche
- [ ] Vérifier que les paramètres sont reçus dans la console
- [ ] Vérifier l'URL de l'API appelée
- [ ] Vérifier le status HTTP de la réponse
- [ ] Comparer avec les données attendues en BD
- [ ] Si erreur: vérifier les logs backend
- [ ] Si 0 résultat: vérifier les critères de filtrage

## 🔗 Liens Importants

- **Frontend**: https://air-frontend-neon.vercel.app
- **Backend API**: https://airbnb-backend-l640.onrender.com/api/search
- **DevTools Console**: F12 ou Ctrl+Shift+J

## 📝 Exemple de Console Saine

```
🔍 Paramètres de recherche reçus: 
  {destination: "Lyon", checkIn: "2026-02-12", availableFrom: "", travelers: "3"}
🔍 RECHERCHE API - Paramètres: 
  {destination: "Lyon", checkIn: "2026-02-12", availableFrom: "", travelers: 3}
📍 Destination: Lyon
📅 CheckIn: 2026-02-12
👥 Voyageurs: 3
🌐 APPEL API RECHERCHE
  📍 URL complète: https://airbnb-backend-l640.onrender.com/api/search/?destination=Lyon&checkIn=2026-02-12&travelers=3&page=1&limit=100
  🔍 Filtres appliqués: {destination: "Lyon", checkIn: "2026-02-12", availableFrom: "", travelers: 3, page: 1, limit: 100}
  📋 Query string: destination=Lyon&checkIn=2026-02-12&travelers=3&page=1&limit=100
📡 Requête GET: https://airbnb-backend-l640.onrender.com/api/search/?...
   Status: 200 OK
✅ Réponse API reçue: {apartments: Array(5), pagination: {…}}
  📦 Nombre d'appartements retournés: 5
  📄 Pagination: {page: 1, limit: 100, total: 5, pages: 1}
📊 RÉSULTAT API: 5 appartement(s) trouvé(s)
🏠 Détails des résultats: (5) [{…}, {…}, {…}, {…}, {…}]
📌 Response complète: {apartments: Array(5), pagination: {…}}
✅ Appartements transformés: (5) [{…}, {…}, {…}, {…}, {…}]
```
