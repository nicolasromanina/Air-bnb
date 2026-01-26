# 🚀 Room 2 Quick Start Guide

## Room 2 Data to Add

```
Chambre 2
Nunc vulputate libero et velit interdum, ac aliquet odio mattis.

jusqu'à 6 invités
2 chambres à coucher
Nunc vulputate libero et velit interdum, ac aliquet odio mattis.

Information générale
Prix standard: 900€/nuit
Nombre de personnes: jusqu'à 6 invités
Nombre de chambres: 2 chambres à coucher
Type de logement: Logement sans fumeur
Inclus: Thé, Café, Petit déjeuner
Équipements et services: Parking sécurisé
```

---

## ⚡ Quick Setup (5 minutes)

### 1️⃣ Seed the Database
```bash
cd E:\Airbnb\okk\hero-showcase\backend
npm run seed:rooms
```

✅ You should see:
```
[SEED] ✅ Room 2 created: { title: 'Chambre 2', price: 900, ... }
[SEED] ✅ Room details seeding completed successfully
```

### 2️⃣ Start Backend
```bash
npm run dev
```

✅ Backend running on `http://localhost:3000`

### 3️⃣ Start Frontend (new terminal)
```bash
cd E:\Airbnb\okk\hero-showcase
npm run dev
```

✅ Frontend running on `http://localhost:5173`

### 4️⃣ Test Admin Page
- Go to: `http://localhost:5173/admin/apartment`
- Click "Chambres" tab
- Click Settings ⚙️ on Room 2
- Check Console (F12) for:
  ```
  [ADMIN] 🔄 Starting to load room details for roomId: 2
  [ADMIN] ✅ Room details loaded successfully: { ... }
  ```

### 5️⃣ Test Client Page
- Go to: `http://localhost:5173/room/2`
- Check Console (F12) for:
  ```
  [DETAIL] 🏠 AppartmentDetail component rendering for room ID: 2
  [DETAIL] ✅ Room detail fetched successfully: { ... }
  ```

### 6️⃣ Test Real-time Sync
1. Keep Room 2 client page open in one tab
2. Open Room 2 admin editor in another tab
3. Edit any field (e.g., price) and click "Sauvegarder"
4. Watch client page update automatically
5. Check Console for sync events

---

## 🔍 Console Logs Reference

### Admin Console Logs
```
[ADMIN] 🔄 Starting to load room details for roomId: 2
[ADMIN] 📝 Updating field: price | new value: 900
[ADMIN] 💾 Starting to save room detail
[ADMIN] ✅ Room detail saved successfully
[ADMIN] 📢 Broadcasting events to other components...
[ADMIN] ✅ Event roomDetailUpdated dispatched
```

### Client Console Logs
```
[DETAIL] 🏠 AppartmentDetail component rendering for room ID: 2
[DETAIL] 🔄 Fetching room detail for room ID: 2
[DETAIL] ✅ Room detail fetched successfully: { ... }
[DETAIL] 📢 Data update event received: { ... }
[DETAIL] 🔄 Refetching room detail for room: 2
```

### Database Seed Logs
```
[SEED] ✅ Room 2 created: {
  title: 'Chambre 2',
  price: 900,
  guests: 'jusqu\'à 6 invités',
  bedrooms: '2 chambres à coucher',
  includes: ['Thé', 'Café', 'Petit déjeuner'],
  amenities: ['Parking sécurisé']
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Create/Update Room 2
```
1. Run: npm run seed:rooms
2. Check MongoDB: db.roomdetails.findOne({ roomId: 2 })
3. Should see all fields with Room 2 data
```

### Scenario 2: Edit Room 2 in Admin
```
1. Go to Admin: /admin/apartment
2. Click Chambres → Settings on Room 2
3. Edit price: 900
4. Edit guests: jusqu'à 6 invités
5. Click Sauvegarder
6. Check console for [ADMIN] ✅ Room detail saved
7. Check DB: data should be updated
```

### Scenario 3: View Room 2 on Client
```
1. Go to /room/2
2. See Room 2 data displayed:
   - Title: Chambre 2
   - Price: 900€/nuit
   - Capacity info
   - Includes/Amenities
3. Check console: [DETAIL] ✅ Room detail fetched
```

### Scenario 4: Real-time Sync
```
1. Open /room/2 in tab A (client)
2. Open /admin/apartment in tab B (admin)
3. In tab B: Edit Room 2 price → Sauvegarder
4. Watch tab A automatically update
5. Tab A console should show: [DETAIL] 📢 Data update event received
```

---

## 🐛 Troubleshooting

| Issue | Solution | Console Check |
|-------|----------|----------------|
| Room 2 not in admin | Run `npm run seed:rooms` | `[SEED] ✅` message |
| Data not loading | Check backend running | `[ADMIN] API Response` |
| Not real-time updating | Check event dispatch | `[ADMIN] ✅ Event dispatched` |
| Client not receiving update | Check listener attached | `[DETAIL] ✅ Event listeners attached` |

---

## 📊 Room 2 Fields

| Field | Value | Type |
|-------|-------|------|
| roomId | 2 | Number |
| title | Chambre 2 | String |
| subtitle | Nunc vulputate libero... | String |
| description | Nunc vulputate libero... | String |
| price | 900 | Number |
| guests | jusqu'à 6 invités | String |
| bedrooms | 2 chambres à coucher | String |
| accommodationType | Logement sans fumeur | String |
| includes | ["Thé", "Café", "Petit déjeuner"] | Array |
| amenities | ["Parking sécurisé"] | Array |
| features | ["Vue panoramique", "Balcon privé", "Salle de bain luxe"] | Array |
| images | [] | Array |

---

## 🎯 What Was Added

✅ **Database Seed Script** (`seed-rooms.ts`)
- Automatically creates Room 2 in MongoDB
- Command: `npm run seed:rooms`

✅ **Admin Logging** (AppartmentEditor.tsx)
- Load room: `[ADMIN] 🔄 Starting to load...`
- Edit fields: `[ADMIN] 📝 Updating field...`
- Save data: `[ADMIN] 💾 Starting to save...`
- Event dispatch: `[ADMIN] 📢 Broadcasting events...`

✅ **Client Logging** (AppartmentDetail.tsx)
- Component mount: `[DETAIL] 🏠 Component rendering...`
- Fetch data: `[DETAIL] 🔄 Fetching room detail...`
- Event listen: `[DETAIL] 📢 Data update event received...`
- Auto refresh: `[DETAIL] 🔄 Refetching room detail...`

✅ **Real-time Sync**
- Admin saves → CustomEvent dispatched → Client updates automatically
- All changes logged to console for debugging

---

## 📝 Files Changed

| File | Change |
|------|--------|
| `backend/src/seeds/seed-rooms.ts` | **NEW** - Room 2 seed script |
| `backend/package.json` | **UPDATED** - Added `seed:rooms` command |
| `src/pages/Admin/AppartmentEditor.tsx` | **ENHANCED** - Added console logs |
| `src/components/appartmentDetail/AppartmentDetail.tsx` | **ENHANCED** - Added console logs |
| `ROOM_2_IMPLEMENTATION_GUIDE.md` | **NEW** - Full documentation |

---

## ✨ Features Enabled

✅ Room 2 stored in database  
✅ Admin can view Room 2 details  
✅ Admin can edit all Room 2 fields  
✅ Admin can save changes  
✅ Changes persist in MongoDB  
✅ Client can view Room 2  
✅ Client sees real-time updates  
✅ Comprehensive debug logging  
✅ Error tracking and feedback  

---

## 🔗 Related Commands

```bash
# Seed Room 2 data
npm run seed:rooms

# Seed additional options
npm run seed

# Start backend
cd backend && npm run dev

# Start frontend
cd .. && npm run dev

# Build frontend
npm run build

# Run tests
npm test
```

---

**Ready to test? Start with: `npm run seed:rooms` → `npm run dev` (backend) → `npm run dev` (frontend)**
