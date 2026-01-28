# 🔧 Contact Form - Améliorations Recommandées
## Implementation Guide pour Production

**Date:** 28 Janvier 2026  
**Version:** 1.0  
**Statut:** Ready for implementation

---

## 1️⃣ Ajouter Rate Limiting (CRITIQUE)

### ⚠️ Pourquoi?
Protéger contre les spams et les attaques DDoS

### Implementation

#### Étape 1: Installer les dépendances
```bash
cd backend
npm install express-rate-limit
npm install --save-dev @types/express-rate-limit
```

#### Étape 2: Créer un middleware
```typescript
// File: backend/src/middleware/rateLimiter.ts

import rateLimit from 'express-rate-limit';

// Limiter pour les formulaires de contact
export const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requêtes par IP
  message: 'Trop de formulaires envoyés. Veuillez réessayer après 15 minutes.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Utiliser le proxy de Render.com
  skip: (req) => {
    // En développement, ne pas appliquer le rate limiting
    return process.env.NODE_ENV === 'development';
  },
  keyGenerator: (req, res) => {
    // Utiliser l'IP réelle derrière le proxy
    return req.headers['x-forwarded-for'] as string || req.ip || 'unknown';
  }
});

// Limiter global (optionnel)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 // 100 requêtes par IP par 15 minutes
});
```

#### Étape 3: Appliquer le middleware
```typescript
// File: backend/src/routes/contactMessageRoutes.ts

import { Router } from 'express';
import contactController from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth.middleware';
import { contactFormLimiter } from '../middleware/rateLimiter'; // 🆕

const router = Router();

// ✅ Route publique AVEC rate limiting
router.post('/submit', contactFormLimiter, contactController.submitContactForm);

// Routes protégées
router.get('/messages', authenticate, contactController.getContactMessages);
router.put('/messages/:id/status', authenticate, contactController.updateMessageStatus);

export default router;
```

#### Étape 4: Tester
```bash
# Test 1: Les 5 premiers requêtes doivent passer
for i in {1..5}; do
  curl -X POST https://airbnb-backend-l640.onrender.com/api/contact-messages/submit \
    -H "Content-Type: application/json" \
    -d '{
      "fullName": "Test '$i'",
      "email": "test'$i'@example.com",
      "phone": "+33612345678",
      "message": "Test message",
      "consent": true
    }'
  echo "Request $i sent"
  sleep 1
done

# Test 2: Le 6ème requête doit être bloqué
curl -X POST https://airbnb-backend-l640.onrender.com/api/contact-messages/submit \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test 6",
    "email": "test6@example.com",
    "phone": "+33612345678",
    "message": "Test message",
    "consent": true
  }'
# Résultat attendu: 429 Too Many Requests
```

---

## 2️⃣ Améliorer le Logging (IMPORTANT)

### Implementation

#### Étape 1: Utiliser Winston pour les logs
```bash
npm install winston
npm install --save-dev @types/winston
```

#### Étape 2: Configurer Winston
```typescript
// File: backend/src/config/logger.ts

import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'contact-service' },
  transports: [
    // Fichier pour les erreurs
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error'
    }),
    // Fichier pour tout
    new winston.transports.File({
      filename: path.join('logs', 'combined.log')
    })
  ]
});

// Console en développement
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
```

#### Étape 3: Utiliser le logger
```typescript
// File: backend/src/controllers/contact.controller.ts

import logger from '../config/logger';

class ContactController {
  async submitContactForm(req: Request, res: Response) {
    const requestId = req.headers['x-request-id'] as string || Date.now().toString();
    
    try {
      logger.info('Contact form submission started', {
        requestId,
        email: req.body.email,
        ip: req.ip
      });

      const { fullName, email, phone, message, consent }: ContactFormData = req.body;

      // Validation
      if (!fullName || !email || !phone || !message) {
        logger.warn('Contact form validation failed - missing fields', {
          requestId,
          email,
          missingFields: {
            fullName: !fullName,
            email: !email,
            phone: !phone,
            message: !message
          }
        });
        return res.status(400).json({
          success: false,
          message: 'Tous les champs obligatoires doivent être remplis'
        });
      }

      if (!consent) {
        logger.warn('Contact form validation failed - consent not given', {
          requestId,
          email
        });
        return res.status(400).json({
          success: false,
          message: 'Vous devez accepter la politique de confidentialité'
        });
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        logger.warn('Contact form validation failed - invalid email format', {
          requestId,
          email
        });
        return res.status(400).json({
          success: false,
          message: 'Format d\'email invalide'
        });
      }

      // Sauvegarde
      const contactMessage = new ContactMessage({
        fullName,
        email,
        phone,
        message,
        consent,
        status: 'new'
      });
      await contactMessage.save();

      logger.info('Contact message saved to database', {
        requestId,
        messageId: contactMessage._id,
        email
      });

      // Envoi emails
      try {
        await emailService.sendContactNotification({
          fullName,
          email,
          phone,
          message
        });

        logger.info('Contact notification email sent', {
          requestId,
          adminEmail: process.env.ADMIN_EMAIL
        });

        await emailService.sendConfirmationEmail(email, {
          fullName,
          message
        });

        logger.info('Contact confirmation email sent to user', {
          requestId,
          userEmail: email
        });
      } catch (emailError) {
        logger.error('Email sending failed', {
          requestId,
          email,
          error: emailError instanceof Error ? emailError.message : String(emailError),
          stack: emailError instanceof Error ? emailError.stack : undefined
        });
        // Ne pas bloquer la sauvegarde
      }

      logger.info('Contact form submission completed successfully', {
        requestId,
        messageId: contactMessage._id,
        email
      });

      res.status(201).json({
        success: true,
        message: 'Votre message a été envoyé avec succès',
        data: {
          id: contactMessage._id,
          createdAt: contactMessage.createdAt
        }
      });

    } catch (error) {
      logger.error('Contact form submission failed', {
        requestId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        body: req.body
      });

      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi du message',
        error: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : String(error) 
          : undefined
      });
    }
  }
}

export default new ContactController();
```

#### Étape 4: Créer le dossier logs
```bash
mkdir -p backend/logs
echo "logs/" >> backend/.gitignore
```

---

## 3️⃣ Ajouter Anti-Spam (IMPORTANT)

### Option A: Honeypot (Simple & Efficace)

#### Frontend - Ajouter un champ invisible
```tsx
// File: src/pages/Contact.tsx

const [formState, setFormState] = useState({
  fullName: '',
  phone: '',
  email: '',
  message: '',
  consent: false,
  website: '' // 🆕 Honeypot field (invisible)
});

// Dans le JSX du formulaire
<div className="hidden">
  <input
    type="text"
    name="website"
    value={formState.website}
    onChange={handleInputChange}
    tabIndex={-1}
    autoComplete="off"
    placeholder="Website"
  />
</div>

// Dans handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  // Vérifier le honeypot
  if (formState.website) {
    setSubmitMessage({
      type: 'error',
      text: 'Une erreur s\'est produite'
    });
    return;
  }

  // ... rest of code
};
```

#### Backend - Vérifier le honeypot
```typescript
// File: backend/src/controllers/contact.controller.ts

async submitContactForm(req: Request, res: Response) {
  try {
    const { fullName, email, phone, message, consent, website } = req.body;

    // ✅ Honeypot check
    if (website && website.trim() !== '') {
      logger.warn('Honeypot triggered', {
        ip: req.ip,
        email: email || 'unknown'
      });
      // Retourner un succès factice pour éviter que le bot ne réessaie
      return res.status(201).json({
        success: true,
        message: 'Votre message a été envoyé avec succès'
      });
    }

    // ... rest of validation and processing
  }
}
```

### Option B: Utiliser reCAPTCHA v3 (Recommandé)

#### Frontend
```bash
npm install @react-google-recaptcha/react react-google-recaptcha-v3
```

```tsx
// File: src/pages/Contact.tsx

import { GoogleReCaptchaProvider, useGoogleReCaptcha } from '@react-google-recaptcha/react';

const ContactForm: React.FC = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get reCAPTCHA token
    const token = await executeRecaptcha?.('submit_contact_form');
    
    if (!token) {
      setSubmitMessage({
        type: 'error',
        text: 'Verification failed'
      });
      return;
    }

    try {
      const response = await contactServices.submitContactForm({
        fullName: formState.fullName,
        phone: formState.phone,
        email: formState.email,
        message: formState.message,
        consent: formState.consent,
        recaptchaToken: token // 🆕
      });
      // ... handle response
    } catch (error) {
      // ... handle error
    }
  };
};

// Wrap l'application
export default function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.VITE_RECAPTCHA_SITE_KEY || ''}>
      <Contact />
    </GoogleReCaptchaProvider>
  );
}
```

#### Backend
```bash
npm install axios
```

```typescript
// File: backend/src/controllers/contact.controller.ts

async submitContactForm(req: Request, res: Response) {
  try {
    const { recaptchaToken, ...formData } = req.body;

    // Vérifier reCAPTCHA
    if (recaptchaToken) {
      try {
        const recaptchaResponse = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify`,
          {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: recaptchaToken
          }
        );

        if (!recaptchaResponse.data.success || recaptchaResponse.data.score < 0.5) {
          logger.warn('reCAPTCHA verification failed', {
            ip: req.ip,
            score: recaptchaResponse.data.score
          });
          return res.status(400).json({
            success: false,
            message: 'Verification failed'
          });
        }
      } catch (recaptchaError) {
        logger.error('reCAPTCHA error', {
          error: recaptchaError instanceof Error ? recaptchaError.message : String(recaptchaError)
        });
        // Ne pas bloquer si reCAPTCHA échoue
      }
    }

    // ... rest of processing
  }
}
```

---

## 4️⃣ Ajouter Monitoring (IMPORTANT)

### Configurer les alertes email pour les erreurs

```typescript
// File: backend/src/services/errorMonitoring.service.ts

import nodemailer from 'nodemailer';
import logger from '../config/logger';

class ErrorMonitoringService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  async sendErrorAlert(error: Error, context: any) {
    try {
      // Ne pas alerter en développement
      if (process.env.NODE_ENV === 'development') {
        logger.error('Error (dev mode)', { error: error.message, context });
        return;
      }

      // Ne pas envoyer trop d'emails (max 1 par heure)
      const lastAlertKey = `error_alert_${error.name}`;
      const lastAlertTime = await this.getCache(lastAlertKey);
      const oneHourAgo = Date.now() - 3600000;

      if (lastAlertTime && lastAlertTime > oneHourAgo) {
        logger.warn('Error alert skipped (already sent recently)', {
          error: error.name
        });
        return;
      }

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `🚨 Error Alert: ${error.name}`,
        html: `
          <h2>Error Alert</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Context:</strong> ${JSON.stringify(context, null, 2)}</p>
          <p><strong>Stack:</strong> <pre>${error.stack}</pre></p>
        `
      });

      await this.setCache(lastAlertKey, Date.now());
      logger.info('Error alert sent', { error: error.name });
    } catch (emailError) {
      logger.error('Failed to send error alert', {
        error: emailError instanceof Error ? emailError.message : String(emailError)
      });
    }
  }

  private async getCache(key: string): Promise<number | null> {
    // Implémentation simple avec Redis ou autre cache
    // Pour l'instant, utiliser une Map en mémoire
    return null;
  }

  private async setCache(key: string, value: number): Promise<void> {
    // Implémentation simple avec Redis ou autre cache
  }
}

export default new ErrorMonitoringService();
```

---

## 5️⃣ Ajouter CORS Configuration

```typescript
// File: backend/src/app.ts

import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://airbnb-clone-frontend.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 6️⃣ Ajouter Request ID pour le Tracing

```typescript
// File: backend/src/middleware/requestId.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  res.setHeader('x-request-id', requestId);
  (req as any).id = requestId;
  next();
};
```

```typescript
// File: backend/src/app.ts

import { requestIdMiddleware } from './middleware/requestId.middleware';

app.use(requestIdMiddleware);
```

---

## 📋 Checklist d'Implementation

- [ ] **Rate Limiting**
  - [ ] Installer `express-rate-limit`
  - [ ] Créer le middleware
  - [ ] Appliquer à la route `/submit`
  - [ ] Tester avec curl/Postman
  - [ ] Ajuster les limites selon les besoins

- [ ] **Logging**
  - [ ] Installer `winston`
  - [ ] Configurer les fichiers logs
  - [ ] Utiliser le logger dans le contrôleur
  - [ ] Tester les logs (fichier + console)
  - [ ] Ajouter `.gitignore` pour le dossier logs

- [ ] **Anti-Spam**
  - [ ] Choisir entre Honeypot ou reCAPTCHA
  - [ ] Implémenter côté frontend
  - [ ] Implémenter côté backend
  - [ ] Tester avec des bots

- [ ] **CORS**
  - [ ] Configurer les origines autorisées
  - [ ] Tester depuis le frontend

- [ ] **Request ID Tracing**
  - [ ] Installer `uuid`
  - [ ] Ajouter le middleware
  - [ ] Utiliser dans les logs

- [ ] **Tests Finaux**
  - [ ] Tester le flux complet
  - [ ] Vérifier les logs
  - [ ] Vérifier les emails
  - [ ] Tester le rate limiting
  - [ ] Tester l'anti-spam

---

## 🚀 Installation Rapide (Script)

```bash
#!/bin/bash

# Installation des dépendances
cd backend
npm install express-rate-limit winston uuid --save

# Créer les fichiers de configuration
mkdir -p src/config
mkdir -p src/middleware
mkdir -p logs

# Copier les fichiers
# ... (copier les fichiers fournis ci-dessus)

# Redémarrer le serveur
npm run dev
```

---

## 📊 Monitoring Dashboard (Optional)

Utiliser un service comme:
- **Sentry** pour le tracking d'erreurs
- **LogRocket** pour la session replay
- **DataDog** pour le monitoring
- **New Relic** pour les performances

```bash
npm install @sentry/node @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## 🎯 Ordre d'Implementation (Recommandé)

1. **Phase 1 (Urgent):** Rate Limiting
2. **Phase 2 (Important):** Logging amélioré
3. **Phase 3 (Important):** Anti-Spam (Honeypot d'abord)
4. **Phase 4 (Nice to have):** CORS, Request ID
5. **Phase 5 (Optional):** Monitoring avancé (Sentry, etc.)

---

Generated: 28 Janvier 2026 | Contact Form Improvements v1.0
