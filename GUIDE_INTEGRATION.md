# 🔌 GUIDE D'INTÉGRATION - NOUVELLES FONCTIONNALITÉS

## 1. Installation dépendances

```bash
# Frontend - graphiques et charts
npm install recharts@2.10.3

# Backend - déjà inclus ✅
```

---

## 2. Intégration Reviews dans AppartmentDetail

### Fichier: `src/pages/ApartmentDetail.tsx`

```typescript
import { ReviewsSection } from '@/components/ReviewsSection';
import { LeaveReviewModal } from '@/components/LeaveReviewModal';

export const ApartmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const apartmentId = parseInt(id || '1');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userReservation, setUserReservation] = useState<Reservation | null>(null);

  // ... existing code ...

  return (
    <div className="min-h-screen bg-white">
      {/* ... Existing hero, details, etc ... */}

      {/* Add Reviews Section */}
      <ReviewsSection apartmentId={apartmentId} />

      {/* Add Review Modal */}
      {userReservation && (
        <LeaveReviewModal
          reservationId={userReservation._id}
          apartmentTitle={apartment.title}
          apartmentImage={apartment.images[0]}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            setShowReviewModal(false);
            // Refresh reviews
          }}
        />
      )}
    </div>
  );
};
```

---

## 3. Intégration AdvancedSearchBar dans Homepage

### Fichier: `src/pages/HomePage.tsx`

```typescript
import { AdvancedSearchBar } from '@/components/AdvancedSearchBar';

export const HomePage = () => {
  return (
    <div>
      {/* Existing hero section */}
      
      {/* Add Advanced Search */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <AdvancedSearchBar />
        </div>
      </section>

      {/* Rest of page */}
    </div>
  );
};
```

---

## 4. Intégration Analytics Dashboard dans Admin

### Fichier: `src/pages/Admin/Dashboard.tsx` (nouvelle page ou existing)

```typescript
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { authenticate, authorize } from '@/middleware/auth';

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

// Route protection
export const adminDashboardRoute = {
  path: '/admin/dashboard',
  element: <AdminDashboard />,
  protected: true,
  requiredRole: 'admin'
};
```

---

## 5. Intégration AvailabilityCalendar

### Fichier: `src/components/appartmentDetail/AppartmentDetail.tsx`

```typescript
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';

// Dans la colonne droite des détails:
<div className="lg:col-span-7">
  <AvailabilityCalendar
    apartmentId={apartmentId}
    onDateRangeSelect={(checkIn, checkOut) => {
      // Handle date selection
      setSelectedDates({ checkIn, checkOut });
    }}
  />
</div>
```

---

## 6. Routes React Router à ajouter

### Fichier: `src/routes/index.tsx` ou `src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchResultsPage from '@/pages/SearchResultsPage';
import AdminDashboard from '@/pages/Admin/AdminDashboard';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/search" element={<SearchResultsPage />} />
      
      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
      />
      <Route
        path="/admin/reviews/moderation"
        element={<ProtectedRoute role="admin"><ReviewModerationPanel /></ProtectedRoute>}
      />
      
      {/* ... other routes ... */}
    </Routes>
  );
};
```

---

## 7. Page Modération Avis (Admin)

### Fichier: `src/pages/Admin/ReviewModerationPanel.tsx` (à créer)

```typescript
import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Star, Check, X, Loader } from 'lucide-react';

export const ReviewModerationPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const response = await api.get('/reviews/admin/pending');
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReviews();
  }, []);

  const handleApprove = async (reviewId: string) => {
    try {
      await api.patch(`/reviews/${reviewId}/approve`);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await api.patch(`/reviews/${reviewId}/reject`);
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  if (loading) {
    return <Loader className="animate-spin" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Review Moderation</h1>
      
      {reviews.length === 0 ? (
        <p className="text-gray-600">No pending reviews</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold">{review.title}</h3>
                  <p className="text-gray-600">{review.authorName}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.comment}</p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(review._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <Check size={18} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(review._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                >
                  <X size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 8. Navigation Admin (ajouter menu)

### Fichier: `src/components/AdminNav.tsx`

```typescript
<nav className="space-y-2">
  <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">
    📊 Analytics
  </Link>
  <Link to="/admin/reviews/moderation" className="block px-4 py-2 hover:bg-gray-100">
    ⭐ Reviews Moderation
  </Link>
  <Link to="/admin/apartments" className="block px-4 py-2 hover:bg-gray-100">
    🏠 Manage Apartments
  </Link>
</nav>
```

---

## 9. Configuration Email Paiement (Backend)

### Fichier: `backend/src/controllers/payment.controller.ts`

```typescript
import { paymentConfirmationTemplate } from '../templates/paymentConfirmation.template';
import { EmailService } from '../services/email.service';

export class PaymentController {
  private emailService = new EmailService();

  async handlePaymentSuccess(payment: IPayment, reservation: IReservation) {
    // Envoyer email de confirmation
    const user = await User.findById(payment.user);
    
    const html = paymentConfirmationTemplate({
      customerName: user?.name || payment.userEmail,
      customerEmail: payment.userEmail,
      reservationId: reservation._id.toString(),
      bookingDates: `${reservation.checkIn.toLocaleDateString()} - ${reservation.checkOut.toLocaleDateString()}`,
      nights: reservation.nights,
      totalAmount: payment.amount,
      currency: payment.currency,
      apartmentTitle: reservation.title,
      apartmentImage: reservation.image,
      paymentDate: new Date().toLocaleDateString(),
      transactionId: payment.paymentIntentId || payment.sessionId
    });

    await this.emailService.send({
      to: payment.userEmail,
      subject: '✓ Payment Confirmed - Your Booking',
      html
    });
  }
}
```

---

## 10. Tests API avec Curl

```bash
# Chercher appartements
curl "http://localhost:3000/api/search?location=Paris&minPrice=100&maxPrice=500"

# Calendrier disponibilité
curl "http://localhost:3000/api/search/calendar/1?month=2&year=2025"

# Créer un avis
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reservationId": "123",
    "rating": 5,
    "title": "Excellent stay!",
    "comment": "Beautiful apartment...",
    "categories": {
      "cleanliness": 5,
      "communication": 5,
      "checkIn": 5,
      "accuracy": 5,
      "location": 5,
      "value": 5
    }
  }'

# Dashboard analytics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/analytics/dashboard/stats

# Avis en attente (admin)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/reviews/admin/pending
```

---

## 11. Variables d'environnement à vérifier

### Backend `.env`:
```
# Email
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Security
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Frontend
FRONTEND_URL=https://your-domain.com
```

### Frontend `.env.production`:
```
VITE_API_URL=https://your-backend.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## ✅ Checklist d'intégration

- [ ] `npm install recharts`
- [ ] Ajouter routes `/search` et `/admin/dashboard`
- [ ] Intégrer ReviewsSection dans AppartmentDetail
- [ ] Intégrer AdvancedSearchBar dans HomePage
- [ ] Créer AdminDashboard page
- [ ] Créer ReviewModerationPanel page
- [ ] Ajouter AvailabilityCalendar dans AppartmentDetail
- [ ] Configurer email paiement dans payment.controller
- [ ] Tester API endpoints
- [ ] Tester flux complet
- [ ] Déployer production

---

**C'est maintenant le moment de tester et de déployer!** 🚀
