# Fix pour Erreur de Timeout en Production (Render)

## Problème
`API Error: timeout of 10000ms exceeded` lors de l'envoi de messages via le formulaire de contact en production sur Render.

## Causes Possibles
1. **Délai d'attente trop court** (10s par défaut)
2. **Serveur Render lent** à répondre (démarrage à froid, ressources limitées)
3. **Envoi d'email SMTP lent** via le backend
4. **Latence réseau** plus importante en production
5. **Problèmes de configuration SMTP** sur le serveur Render

## Solutions Appliquées

### 1. ✅ Frontend - Augmentation du Timeout
**Fichier:** `src/services/contactApi.ts`

- Timeout global: **30 secondes** (au lieu de 10s)
- Timeout pour soumission formulaire: **45 secondes** (pour l'envoi d'email)

```typescript
// Global timeout
timeout: 30000, // 30s

// Pour submitContactForm
timeout: 45000, // 45s pour l'envoi d'email
```

### 2. ✅ Frontend - Meilleure Gestion des Erreurs
**Fichier:** `src/pages/Contact.tsx`

- Messages d'erreur plus explicites pour les timeouts
- Distinction entre timeout et autres erreurs
- Conseils utilisateurs clairs (recharger, réessayer, etc.)

### 3. 🔧 Backend Recommendations pour Render

#### A. Optimiser les Timeouts du Backend
```javascript
// Dans le contrôleur de contact du backend
router.post('/contact-messages/submit', 
  express.json({ timeout: '60s' }), // Express timeout
  contactController.submitContactForm
);

// Pour Nodemailer SMTP
const transporter = nodemailer.createTransport({
  // ...
  connectionTimeout: 10000,
  socketTimeout: 15000,
});
```

#### B. Utiliser une Queue pour les Emails
Éviter les timeouts en mettant les emails en file d'attente:
```bash
npm install bull redis
```

```javascript
const queue = new Queue('email', {
  redis: { host: 'redis-url', port: 6379 }
});

// Au lieu d'envoyer directement
await queue.add({ to: email, subject: 'Contact', body: message });

// Traiter la file en arrière-plan
queue.process(async (job) => {
  await transporter.sendMail(job.data);
});
```

#### C. Configurer SMTP Correctement
Vérifier dans les variables d'environnement Render:

```env
# .env sur Render
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-specific-password
SMTP_FROM_NAME="Hero Apartments"
```

**Recommandations:**
- Utiliser un service SMTP fiable (Gmail, SendGrid, Mailgun)
- Configurer TLS/STARTTLS
- Tester avec `telnet` ou outils en ligne

#### D. Monitorer les Performances
Ajouter des logs au backend:

```javascript
const startTime = Date.now();

// ... traiter la requête ...

const duration = Date.now() - startTime;
console.log(`Contact form submission took ${duration}ms`);

if (duration > 30000) {
  logger.warn(`Slow contact submission: ${duration}ms`);
}
```

#### E. Configurer Healthcheck sur Render
Ajouter un endpoint healthcheck pour éviter les cold starts:

```javascript
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});
```

Configurer dans Render:
- **Health Check Path:** `/api/health`
- **Check Interval:** `30 seconds`
- **Timeout:** `5 seconds`

### 4. 🔍 Tests Recommandés

#### Test Local vs Production
```bash
# Test local (backend en localhost)
curl -X POST http://localhost:5000/api/contact-messages/submit \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","phone":"+33612345678","message":"Test message","consent":true}'

# Test production (Render)
curl -X POST https://airbnb-backend-l640.onrender.com/api/contact-messages/submit \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","phone":"+33612345678","message":"Test message","consent":true}'
```

#### Mesurer le Temps de Réponse
```bash
# Sur le frontend, checker Network tab dans DevTools
# Temps = Response time + Processing time
```

### 5. 📊 Métriques à Surveiller

| Métrique | Cible | Action si > Cible |
|----------|-------|------------------|
| API Response Time | < 5s | Optimiser backend |
| SMTP Send Time | < 15s | Changer provider SMTP |
| Total Request | < 45s | Implémenter Queue |
| Cold Start | < 30s | Configurer Keep-Alive |

## Checklist de Vérification

- [x] Frontend timeout augmenté à 30s
- [x] Timeout formulaire contact à 45s
- [x] Messages d'erreur améliorés
- [ ] Backend SMTP configuré correctement
- [ ] Health check activé sur Render
- [ ] Logs ajoutés au backend
- [ ] Queue email implémentée (optionnel mais recommandé)
- [ ] Tests effectués en production
- [ ] Monitoring en place

## Support

Si le problème persiste:
1. Vérifier les logs Render: `Render > Services > Backend > Logs`
2. Tester la connexion SMTP directement
3. Contacter le support Render pour les problèmes de performance
4. Considérer passer à un plan supérieur si ressources insuffisantes

## References
- [Render Documentation](https://render.com/docs)
- [Nodemailer SMTP Configuration](https://nodemailer.com/)
- [Bull Queue Library](https://optimalbits.github.io/bull/)
