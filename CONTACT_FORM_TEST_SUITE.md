# 🧪 Contact Form API - Test Suite
## Test Cases & cURL Examples

**Date:** 28 Janvier 2026  
**Version:** 1.0  
**API Base:** `https://airbnb-backend-l640.onrender.com/api`

---

## 📝 Résumé des Endpoints

| # | Méthode | Endpoint | Authentification | Description |
|---|---------|----------|-----------------|-------------|
| 1 | POST | `/contact-messages/submit` | ❌ Non | Soumettre un formulaire contact |
| 2 | GET | `/contact-messages/messages` | ✅ JWT | Récupérer tous les messages |
| 3 | PUT | `/contact-messages/messages/:id/status` | ✅ JWT | Mettre à jour le statut |

---

## 🧪 Test 1: Soumission Complète (Happy Path)

### Description
Soumettez un formulaire de contact complet et valide

### cURL Request
```bash
curl -X POST https://airbnb-backend-l640.onrender.com/api/contact-messages/submit \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "phone": "+33 6 12 34 56 78",
    "message": "Bonjour, je suis très intéressé par vos services. Pouvez-vous me contacter pour plus de détails ?",
    "consent": true
  }'
```

### Résultat Attendu
```json
{
  "success": true,
  "message": "Votre message a été envoyé avec succès",
  "data": {
    "id": "65b1234567890abcdef12345",
    "createdAt": "2024-01-28T10:30:45.123Z"
  }
}
```

### Status Code
```
201 Created
```

### Vérifications
- ✅ Message sauvegardé en base de données
- ✅ Email de notification envoyé à l'admin
- ✅ Email de confirmation envoyé à l'utilisateur
- ✅ Response contient l'ID du message

---

## 🧪 Test 2: Validation - Champs Manquants

### Description
Essayez de soumettre sans le prénom

### cURL Request
```bash
curl -X POST https://airbnb-backend-l640.onrender.com/api/contact-messages/submit \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "",
    "email": "test@example.com",
    "phone": "+33612345678",
    "message": "Test",
    "consent": true
  }'
```

### Résultat Attendu
```json
{
  "success": false,
  "message": "Tous les champs obligatoires doivent être remplis"
}
```

### Status Code
```
400 Bad Request
```

---

## 🧪 Test 3: Validation - Email Invalide

### Description
Email avec format invalide

### cURL Request
```bash
curl -X POST https://airbnb-backend-l640.onrender.com/api/contact-messages/submit \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jean Dupont",
    "email": "invalid-email-format",
    "phone": "+33612345678",
    "message": "Test message",
    "consent": true
  }'
```

### Résultat Attendu
```json
{
  "success": false,
  "message": "Format d'email invalide"
}
```

### Status Code
```
400 Bad Request
```

---

## 🧪 Test 4: Validation - Consent Manquant

### Description
Formulaire soumis sans accepter la politique de confidentialité

### cURL Request
```bash
curl -X POST https://airbnb-backend-l640.onrender.com/api/contact-messages/submit \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "+33612345678",
    "message": "Test message",
    "consent": false
  }'
```

### Résultat Attendu
```json
{
  "success": false,
  "message": "Vous devez accepter la politique de confidentialité"
}
```

### Status Code
```
400 Bad Request
```

---

## 🧪 Test 5: Récupérer les Messages (Admin)

### Description
Récupérer tous les messages de contact (route protégée)

### cURL Request
```bash
# Remplacer YOUR_JWT_TOKEN par un token valide
curl -X GET https://airbnb-backend-l640.onrender.com/api/contact-messages/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Résultat Attendu
```json
{
  "success": true,
  "data": [
    {
      "_id": "65b1234567890abcdef12345",
      "fullName": "Jean Dupont",
      "email": "jean@example.com",
      "phone": "+33612345678",
      "message": "Test message",
      "consent": true,
      "status": "new",
      "createdAt": "2024-01-28T10:30:45.123Z",
      "updatedAt": "2024-01-28T10:30:45.123Z"
    },
    {
      "_id": "65b1234567890abcdef12346",
      "fullName": "Marie Martin",
      "email": "marie@example.com",
      "phone": "+33687654321",
      "message": "Deuxième message",
      "consent": true,
      "status": "read",
      "createdAt": "2024-01-28T11:00:00.000Z",
      "updatedAt": "2024-01-28T11:30:00.000Z"
    }
  ]
}
```

### Status Code
```
200 OK
```

---

## 🧪 Test 6: Mettre à Jour le Statut d'un Message

### Description
Changer le statut d'un message de "new" à "read"

### cURL Request
```bash
# Remplacer MESSAGE_ID et YOUR_JWT_TOKEN
curl -X PUT https://airbnb-backend-l640.onrender.com/api/contact-messages/messages/65b1234567890abcdef12345/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "read"
  }'
```

### Résultat Attendu
```json
{
  "success": true,
  "data": {
    "_id": "65b1234567890abcdef12345",
    "fullName": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "+33612345678",
    "message": "Test message",
    "consent": true,
    "status": "read",
    "createdAt": "2024-01-28T10:30:45.123Z",
    "updatedAt": "2024-01-28T10:40:00.000Z"
  }
}
```

### Status Code
```
200 OK
```

---

## 🧪 Test 7: Statut Invalide

### Description
Essayez de mettre un statut invalide

### cURL Request
```bash
curl -X PUT https://airbnb-backend-l640.onrender.com/api/contact-messages/messages/65b1234567890abcdef12345/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "invalid_status"
  }'
```

### Résultat Attendu
```json
{
  "success": false,
  "message": "Statut invalide"
}
```

### Status Code
```
400 Bad Request
```

---

## 🧪 Test 8: Message Non Trouvé

### Description
Essayez de mettre à jour un message qui n'existe pas

### cURL Request
```bash
curl -X PUT https://airbnb-backend-l640.onrender.com/api/contact-messages/messages/invalid_id_format/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "read"
  }'
```

### Résultat Attendu
```json
{
  "success": false,
  "message": "Message non trouvé"
}
```

### Status Code
```
404 Not Found
```

---

## 🧪 Test 9: Non Authentifié (Admin Routes)

### Description
Essayez d'accéder aux routes protégées sans JWT

### cURL Request
```bash
curl -X GET https://airbnb-backend-l640.onrender.com/api/contact-messages/messages
```

### Résultat Attendu
```json
{
  "success": false,
  "message": "Authentification requise" 
  // ou "No token provided" selon votre implémentation
}
```

### Status Code
```
401 Unauthorized
```

---

## 🧪 Test 10: Token JWT Invalide

### Description
Essayez avec un JWT invalide

### cURL Request
```bash
curl -X GET https://airbnb-backend-l640.onrender.com/api/contact-messages/messages \
  -H "Authorization: Bearer invalid.token.here"
```

### Résultat Attendu
```json
{
  "success": false,
  "message": "Token invalide"
  // ou "Invalid token" selon votre implémentation
}
```

### Status Code
```
401 Unauthorized
```

---

## 🧪 Test 11: Charge Massive (Stress Test)

### Description
Envoyer plusieurs messages rapidement

### Script Bash
```bash
#!/bin/bash

for i in {1..10}; do
  curl -X POST https://airbnb-backend-l640.onrender.com/api/contact-messages/submit \
    -H "Content-Type: application/json" \
    -d '{
      "fullName": "User '$i'",
      "email": "user'$i'@example.com",
      "phone": "+3361234567'$i'",
      "message": "Message number '$i'",
      "consent": true
    }' \
    --silent &
done

wait
echo "All requests sent"
```

### Vérifications
- ✅ Tous les messages sont sauvegardés
- ✅ Pas de doublons
- ✅ Pas de corruption de données
- ✅ Réponse temps < 2 secondes

---

## 🧪 Test 12: Test avec Postman

### Import Collection
```json
{
  "info": {
    "name": "Contact Form API",
    "description": "Tests pour l'API de formulaire de contact"
  },
  "item": [
    {
      "name": "Submit Contact Form",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"fullName\": \"Test User\", \"email\": \"test@example.com\", \"phone\": \"+33612345678\", \"message\": \"Test\", \"consent\": true}"
        },
        "url": {
          "raw": "{{baseUrl}}/contact-messages/submit",
          "host": ["{{baseUrl}}"],
          "path": ["contact-messages", "submit"]
        }
      }
    },
    {
      "name": "Get All Messages",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/contact-messages/messages",
          "host": ["{{baseUrl}}"],
          "path": ["contact-messages", "messages"]
        }
      }
    }
  ]
}
```

**Variables Postman:**
```
baseUrl: https://airbnb-backend-l640.onrender.com/api
jwt_token: YOUR_JWT_TOKEN
```

---

## 📊 Test Results Template

```markdown
## Test Execution Report - [DATE]

### Environment
- API URL: https://airbnb-backend-l640.onrender.com/api
- Frontend: localhost:5173 (dev) / production-url (prod)
- Database: MongoDB Atlas
- Email Service: Configured

### Test Results

| Test | Status | Notes |
|------|--------|-------|
| Test 1: Happy Path | ✅ PASS | Message créé avec succès |
| Test 2: Missing Fields | ✅ PASS | Erreur 400 retournée |
| Test 3: Invalid Email | ✅ PASS | Format validation fonctionne |
| Test 4: Missing Consent | ✅ PASS | Consent requis |
| Test 5: Get Messages | ✅ PASS | JWT auth fonctionne |
| Test 6: Update Status | ✅ PASS | Statut mis à jour |
| Test 7: Invalid Status | ✅ PASS | Validation enum OK |
| Test 8: Not Found | ✅ PASS | 404 retourné |
| Test 9: No Auth | ✅ PASS | 401 retourné |
| Test 10: Invalid Token | ✅ PASS | Token rejected |
| Test 11: Stress Test | ✅ PASS | 10/10 messages ok |
| Test 12: Postman | ✅ PASS | Collection fonctionnelle |

### Email Verification
- ✅ Admin notification email received
- ✅ User confirmation email received
- ✅ Email templates rendering correctly
- ✅ Links functional

### Database Verification
- ✅ Messages stored correctly
- ✅ Status field updated
- ✅ Timestamps correct
- ✅ No data corruption

### Performance
- Average response time: XXX ms
- 95th percentile: XXX ms
- Max response time: XXX ms

### Issues Found
- None / [List any issues]

### Recommendations
- [List any recommendations]

### Sign-Off
- Tested by: [Name]
- Date: [Date]
- Status: ✅ APPROVED FOR PRODUCTION
```

---

## 🚀 Automated Testing (Jest)

```typescript
// File: backend/tests/contact.test.ts

import request from 'supertest';
import app from '../src/app';
import ContactMessage from '../src/models/ContactMessage';

describe('Contact Form API', () => {
  
  beforeAll(async () => {
    // Setup database connection
  });

  afterAll(async () => {
    // Close database connection
  });

  describe('POST /api/contact-messages/submit', () => {
    
    it('should submit a valid contact form', async () => {
      const res = await request(app)
        .post('/api/contact-messages/submit')
        .send({
          fullName: 'Jean Dupont',
          email: 'jean@example.com',
          phone: '+33612345678',
          message: 'Test message',
          consent: true
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
    });

    it('should reject missing fullName', async () => {
      const res = await request(app)
        .post('/api/contact-messages/submit')
        .send({
          fullName: '',
          email: 'jean@example.com',
          phone: '+33612345678',
          message: 'Test message',
          consent: true
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/contact-messages/submit')
        .send({
          fullName: 'Jean Dupont',
          email: 'invalid-email',
          phone: '+33612345678',
          message: 'Test message',
          consent: true
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('email');
    });

    it('should reject missing consent', async () => {
      const res = await request(app)
        .post('/api/contact-messages/submit')
        .send({
          fullName: 'Jean Dupont',
          email: 'jean@example.com',
          phone: '+33612345678',
          message: 'Test message',
          consent: false
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('consent');
    });
  });

  describe('GET /api/contact-messages/messages', () => {
    
    it('should return all messages with valid JWT', async () => {
      const token = 'valid_jwt_token'; // Obtenir un token valid
      const res = await request(app)
        .get('/api/contact-messages/messages')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should reject without JWT', async () => {
      const res = await request(app)
        .get('/api/contact-messages/messages');

      expect(res.statusCode).toBe(401);
    });
  });
});
```

### Lancer les tests
```bash
npm test -- contact.test.ts
```

---

## 📋 Checklist de Test Avant Production

- [ ] Test 1: Happy path (soumission complète)
- [ ] Test 2: Champs manquants
- [ ] Test 3: Email invalide
- [ ] Test 4: Consent manquant
- [ ] Test 5: Récupération des messages (auth OK)
- [ ] Test 6: Mise à jour du statut
- [ ] Test 7: Statut invalide
- [ ] Test 8: Message non trouvé (404)
- [ ] Test 9: Non authentifié (401)
- [ ] Test 10: Token invalide (401)
- [ ] Test 11: Charge/Stress test
- [ ] Test 12: Postman collection
- [ ] Test 13: Emails reçus (admin + user)
- [ ] Test 14: Database integrity
- [ ] Test 15: Performance (< 2s)
- [ ] Test 16: Error logging
- [ ] Test 17: CORS configuration
- [ ] Test 18: Rate limiting

---

Generated: 28 Janvier 2026 | Contact Form Test Suite v1.0
