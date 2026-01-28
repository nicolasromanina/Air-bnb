# ⚡ QUICK START - IMPLÉMENTATION 5 MINUTES

## 1️⃣ Installation Recharts (1 minute)

```bash
npm install recharts@2.10.3
```

---

## 2️⃣ Ajouter routes frontend (2 minutes)

### Fichier: `src/App.tsx` ou `src/routes/index.tsx`

```typescript
// Ajouter les imports
import SearchResultsPage from '@/pages/SearchResultsPage';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

// Ajouter les routes (dans <Routes>)
<Route path="/search" element={<SearchResultsPage />} />
<Route 
  path="/admin/dashboard" 
  element={<ProtectedRoute role="admin"><AnalyticsDashboard /></ProtectedRoute>} 
/>
```

---

## 3️⃣ Ajouter ReviewsSection dans AppartmentDetail (1 minute)

### Fichier: `src/pages/ApartmentDetail.tsx` ou équivalent

Ajouter avant le closing div:

```typescript
import { ReviewsSection } from '@/components/ReviewsSection';

// ... dans le return, à la fin:
<ReviewsSection apartmentId={apartmentId} />
```

---

## 4️⃣ Tester les endpoints (1 minute)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Tests
curl http://localhost:3000/api/search/filters
curl http://localhost:3000/api/analytics/dashboard/stats
```

---

## 🎯 Résultats immédiats

✅ Recherche avec filtres fonctionne  
✅ Dashboard analytics visible  
✅ Avis affichés sur pages  
✅ Calendrier disponibilité visible  

---

## 📋 Prochaines étapes (optionnelles)

```bash
# 1. Ajouter AdvancedSearchBar en homepage
import { AdvancedSearchBar } from '@/components/AdvancedSearchBar';

# 2. Ajouter LeaveReviewModal post-réservation
<LeaveReviewModal 
  reservationId={reservation._id}
  onSuccess={onRefresh}
/>

# 3. Admin modération avis
# → Créer page: src/pages/Admin/ReviewModerationPanel.tsx

# 4. Test emails
# → Passer test Stripe webhook
# → Email se sent automatiquement
```

---

**C'est tout! La majorité des fonctionnalités sont maintenant disponibles.** ✨
