# ⚡ Quick Start - Système Amélioré d'Annulation

## 1️⃣ Comprendre le Système en 5 Minutes

### Le Problème Résolu
**Avant:** Tous les cancellations étaient traitées uniformément, peu importe si le guest était check-in ou non.
**Après:** Le système distingue 5 types d'actions différentes selon le moment du séjour.

### Les 5 Actions

```
┌─────────────────────────────────────────────────┐
│ ANNULATION (Avant check-in)                     │
├─────────────────────────────────────────────────┤
│ Endpoint: POST /api/reservations/:id/cancel     │
│ Status: confirmed → cancelled                   │
│ Remboursement: 0-100% selon timing              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ DÉPART ANTICIPÉ (Après check-in)                │
├─────────────────────────────────────────────────┤
│ Endpoint: POST /api/reservations/:id/early-checkout
│ Status: confirmed → early_checkout              │
│ Remboursement: Proportionnel aux jours restants │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ MODIFICATION (Avant check-in)                   │
├─────────────────────────────────────────────────┤
│ Endpoint: POST /api/reservations/:id/modify     │
│ Status: confirmed (inchangé)                    │
│ Recalcul du prix selon nouvelles dates          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LITIGE (Anytime)                                │
├─────────────────────────────────────────────────┤
│ Endpoint: POST /api/reservations/:id/dispute    │
│ Status: any → dispute                           │
│ Révision manuelle par équipe support            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ CHECKOUT STANDARD (À check-out prévue)          │
├─────────────────────────────────────────────────┤
│ Endpoint: PUT /api/reservations/:id/status      │
│ Status: confirmed → completed                   │
│ Aucun remboursement                             │
└─────────────────────────────────────────────────┘
```

---

## 2️⃣ Test Rapide (5 minutes)

### Setup

```bash
# 1. Aller au répertoire backend
cd backend

# 2. Démarrer le serveur
npm run dev
# ou avec pm2
pm2 start "npm run dev" --name="hero-api"

# 3. Obtenir un token de test
export TOKEN="your_bearer_token_here"
export API="http://localhost:3000"
```

### Test 1: Cancellation Standard

```bash
curl -X POST $API/api/reservations/test123/cancel \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Plans changed"
  }'

# Expected Response:
{
  "success": true,
  "reservation": {
    "status": "cancelled",
    "actionType": "cancellation",
    "refundPercentage": 100
  },
  "refund": {
    "percentage": 100,
    "amount": 500
  }
}
```

### Test 2: Early Checkout

```bash
curl -X POST $API/api/reservations/test124/early-checkout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Family emergency"
  }'

# Expected Response:
{
  "success": true,
  "reservation": {
    "status": "early_checkout",
    "actionType": "early_checkout",
    "refundPercentage": 45
  }
}
```

### Test 3: Error - Cannot Cancel if Checked In

```bash
curl -X POST $API/api/reservations/test125/cancel \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Change of plans"
  }'

# Expected Response (400):
{
  "success": false,
  "error": "Cannot cancel: guest is already checked in. Please use early checkout endpoint instead. Endpoint: POST /api/reservations/:id/early-checkout"
}
```

---

## 3️⃣ Code Examples

### JavaScript/React

```typescript
import { useState } from 'react';

export function ReservationActions({ reservationId, status, checkIn }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isCheckedIn = new Date(checkIn) <= new Date();

  const handleCancel = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/reservations/${reservationId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reason: 'User cancellation'
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      // Show success message
      alert(
        `Cancelled! Refund: €${data.refund.amount} (${data.refund.percentage}%)`
      );

      // Reload reservations
      location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEarlyCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/reservations/${reservationId}/early-checkout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reason: 'Leaving early'
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      alert(
        `Early checkout confirmed! Refund: €${data.refund.amount}`
      );
      location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}

      {!isCheckedIn ? (
        <button onClick={handleCancel} disabled={loading}>
          {loading ? 'Processing...' : 'Cancel Reservation'}
        </button>
      ) : (
        <button onClick={handleEarlyCheckout} disabled={loading}>
          {loading ? 'Processing...' : 'Early Checkout'}
        </button>
      )}
    </div>
  );
}
```

### Python

```python
import requests
from datetime import datetime

class ReservationClient:
    def __init__(self, api_url, token):
        self.api_url = api_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def cancel_reservation(self, reservation_id, reason=''):
        """Cancel a reservation (before check-in only)"""
        url = f'{self.api_url}/api/reservations/{reservation_id}/cancel'
        data = {'reason': reason}
        
        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        
        return response.json()

    def request_early_checkout(self, reservation_id, reason=''):
        """Request early checkout (after check-in)"""
        url = f'{self.api_url}/api/reservations/{reservation_id}/early-checkout'
        data = {'reason': reason}
        
        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        
        return response.json()

    def modify_reservation(self, reservation_id, check_in=None, check_out=None, reason=''):
        """Modify reservation dates"""
        url = f'{self.api_url}/api/reservations/{reservation_id}/modify'
        data = {
            'checkIn': check_in.isoformat() if check_in else None,
            'checkOut': check_out.isoformat() if check_out else None,
            'reason': reason
        }
        
        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        
        return response.json()

    def raise_dispute(self, reservation_id, dispute_reason):
        """Raise a dispute for a reservation"""
        url = f'{self.api_url}/api/reservations/{reservation_id}/dispute'
        data = {'disputeReason': dispute_reason}
        
        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        
        return response.json()

# Usage
client = ReservationClient('http://api.example.com', 'your_token')

# Cancel
result = client.cancel_reservation('abc123', 'Plans changed')
print(f"Refund: €{result['refund']['amount']} ({result['refund']['percentage']}%)")

# Early checkout
result = client.request_early_checkout('abc123', 'Emergency')
print(f"Status: {result['reservation']['status']}")

# Dispute
result = client.raise_dispute('abc123', 'Apartment not as described')
print(f"Case: {result['reservation']['_id']}-DISPUTE")
```

---

## 4️⃣ Fichiers Clés à Consulter

### Pour Comprendre:
- [IMPROVED_CANCELLATION_SYSTEM.md](IMPROVED_CANCELLATION_SYSTEM.md) - Vue d'ensemble avec diagrammes

### Pour Intégrer:
- [IMPROVED_CANCELLATION_INTEGRATION_GUIDE.md](IMPROVED_CANCELLATION_INTEGRATION_GUIDE.md) - Tous les endpoints, exemples

### Pour Déployer:
- [DEPLOYMENT_CHECKLIST_CANCELLATION_SYSTEM.md](DEPLOYMENT_CHECKLIST_CANCELLATION_SYSTEM.md) - Checklist 12 phases

### Code Source:
- `backend/src/models/Reservation.ts` - Modèle de données
- `backend/src/services/reservation.service.ts` - Logique métier
- `backend/src/controllers/reservation.controller.ts` - Endpoints
- `backend/src/routes/reservation.routes.ts` - Routes

---

## 5️⃣ Troubleshooting Courant

### Error: "guest is already checked in"

```
Cause: Vous tentez d'annuler une réservation après que le guest ait check-in
Solution: Utiliser POST /early-checkout au lieu de POST /cancel
```

### Error: "Cannot cancel reservation less than 24 hours before check-in"

```
Cause: Annulation trop tard (< 24h avant arrivée)
Solution: Attendre ou traiter comme "early checkout" si guest arrive
```

### Error: "Reservation not found"

```
Cause: L'ID n'existe pas ou appartient à un autre utilisateur
Solution: Vérifier l'ID et votre authentication
```

### Email not received

```
Cause: Configuration SMTP invalide ou email provider issue
Solution: 
1. Vérifier .env (SMTP_HOST, SMTP_USER, SMTP_PASS)
2. Vérifier logs: grep "email" backend/logs/*.log
3. Tester connexion SMTP: node scripts/test-smtp.js
```

---

## 6️⃣ Checklist de Développeur

Avant de committer:

- [ ] Code compile sans erreur TypeScript
- [ ] Tests unitaires passent: `npm test`
- [ ] Lint ne retourne pas d'erreur: `npm run lint`
- [ ] Au moins 1 endpoint testé manuellement
- [ ] Email envoyé correctement
- [ ] Commit message descriptif

Avant de merger:

- [ ] Code revu par 1 autre dev
- [ ] Tests d'intégration passent
- [ ] Documentation à jour

Avant de déployer:

- [ ] Voir [DEPLOYMENT_CHECKLIST_CANCELLATION_SYSTEM.md](DEPLOYMENT_CHECKLIST_CANCELLATION_SYSTEM.md)

---

## 7️⃣ Ressources

### Documentation Officielle:
- [Express.js](https://expressjs.com/) - Web framework
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [Nodemailer](https://nodemailer.com/) - Email service

### Notre Documentation:
- [API Documentation](README_DOCUMENTATION.md)
- [Email Setup Guide](README_EMAIL_SETUP.md)
- [Production Deployment](PRODUCTION_DEPLOYMENT_GUIDE.md)

---

## 8️⃣ Support

### Questions Rapides?
- Consulter les **Scénarios Réels** ci-dessus
- Consulter [IMPROVED_CANCELLATION_INTEGRATION_GUIDE.md](IMPROVED_CANCELLATION_INTEGRATION_GUIDE.md)

### Bug Report?
- Créer GitHub Issue avec tag `cancellation-system`
- Inclure: endpoint, payload, response, logs

### Feature Request?
- Ouvrir discussion GitHub
- Expliquer le cas d'usage
- Proposer solution si possible

---

**Last Updated:** 15 Janvier 2024
**Status:** ✅ Ready for Use
