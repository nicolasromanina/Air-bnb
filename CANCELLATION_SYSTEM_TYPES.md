# 📘 TypeScript Types & Interfaces - Système Amélioré d'Annulation

Ce fichier contient tous les types TypeScript pour le système amélioré d'annulation.
À utiliser pour l'autocomplétion et la validation des types.

---

## Enum: Statuses de Réservation

```typescript
// backend/src/models/Reservation.ts

enum ReservationStatus {
  PENDING = 'pending',           // Réservation nouvelle, en attente de confirmation
  CONFIRMED = 'confirmed',       // Confirmée, en attente du check-in
  CHECKED_IN = 'checked_in',     // Guest actuellement présent
  COMPLETED = 'completed',       // Séjour terminé (checkout normal)
  CANCELLED = 'cancelled',       // Annulée avant check-in
  EARLY_CHECKOUT = 'early_checkout',   // Guest a quitté plus tôt
  DISPUTE = 'dispute'            // Litige en cours de résolution
}

type ReservationStatusType = 
  | 'pending' 
  | 'confirmed' 
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'early_checkout'
  | 'dispute';
```

---

## Enum: Types d'Actions

```typescript
// backend/src/models/Reservation.ts

enum ActionType {
  CANCELLATION = 'cancellation',           // Annulation avant check-in
  EARLY_CHECKOUT = 'early_checkout',       // Départ anticipé
  MODIFICATION = 'modification',           // Changement de dates
  DISPUTE_RESOLUTION = 'dispute_resolution', // Litige signalé
  CHECKOUT = 'checkout'                    // Checkout standard
}

type ActionTypeValue = 
  | 'cancellation' 
  | 'early_checkout'
  | 'modification'
  | 'dispute_resolution'
  | 'checkout';
```

---

## Interface: IReservation (Complet)

```typescript
// backend/src/models/Reservation.ts

interface IReservation extends Document {
  // Identifiants et relations
  _id: ObjectId;
  user: ObjectId;              // Référence à User
  payment?: ObjectId;          // Référence à Payment
  apartmentId: number;
  apartmentNumber: string;

  // Détails de réservation
  title: string;
  image: string;
  includes: string[];
  
  // Dates et durée
  checkIn: Date;
  checkOut: Date;
  nights: number;
  
  // Détails du séjour
  guests: number;
  bedrooms: number;
  totalPrice: number;
  pricePerNight: number;
  
  // Options supplémentaires
  additionalOptions?: {
    optionId: ObjectId;
    name: string;
    price: number;
    quantity: number;
  }[];

  // STATUS ET ACTIONS
  status: ReservationStatusType;
  actionType?: ActionTypeValue;

  // CANCELLATION (avant check-in)
  cancellationReason?: string;
  cancellationRequestedAt?: Date;

  // EARLY CHECKOUT (après check-in)
  actualCheckoutDate?: Date;
  earlyCheckoutReason?: string;

  // MODIFICATION (changement dates)
  originalCheckOut?: Date;
  modificationReason?: string;
  modifiedAt?: Date;

  // DISPUTE (litige)
  disputeReason?: string;
  disputeResolution?: string;
  disputeResolvedAt?: Date;

  // REMBOURSEMENT
  refundAmount?: number;
  refundPercentage?: number;
  refundProcessedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Interface: Request Bodies (Endpoints)

### 1. Cancel Reservation

```typescript
interface CancelReservationRequest {
  reason?: string;  // Optional: raison de l'annulation
}

interface CancelReservationResponse {
  success: boolean;
  reservation: IReservation;
  refund: {
    percentage: number;  // 0-100
    amount: number;      // €
  };
  message: string;
}
```

### 2. Early Checkout

```typescript
interface EarlyCheckoutRequest {
  reason?: string;  // Optional: raison du départ anticipé
}

interface EarlyCheckoutResponse {
  success: boolean;
  reservation: IReservation;
  refund: {
    percentage: number;  // Pour jours restants
    amount: number;      // €
  };
  message: string;
}
```

### 3. Modify Reservation

```typescript
interface ModifyReservationRequest {
  checkIn?: string;   // ISO 8601 date
  checkOut?: string;  // ISO 8601 date
  reason?: string;    // Optional: raison de modification
}

interface ModifyReservationResponse {
  success: boolean;
  reservation: IReservation;
  message: string;
}
```

### 4. Raise Dispute

```typescript
interface RaiseDisputeRequest {
  disputeReason: string;  // Required: description du litige
}

interface RaiseDisputeResponse {
  success: boolean;
  reservation: IReservation;
  message: string;  // "Dispute raised successfully. Our team will review this shortly."
}
```

---

## Interface: Service Methods

```typescript
// backend/src/services/reservation.service.ts

class ReservationService {
  
  /**
   * Check if guest is currently checked in
   * @param reservation - Reservation document
   * @returns true if guest is between checkIn and checkOut dates
   */
  isCheckedIn(reservation: IReservation): boolean;

  /**
   * Calculate refund percentage based on timing
   * @param reservation - Reservation document
   * @returns Refund percentage (0-100)
   */
  calculateRefundPercentage(reservation: IReservation): number;

  /**
   * Request cancellation (before check-in)
   * @param id - Reservation ID
   * @param userId - User ID
   * @param reason - Optional cancellation reason
   * @returns Updated reservation with cancellation details
   */
  async requestCancellation(
    id: string,
    userId: string,
    reason?: string
  ): Promise<IReservation>;

  /**
   * Process early checkout (after check-in)
   * @param id - Reservation ID
   * @param userId - User ID
   * @param reason - Optional reason for early checkout
   * @returns Updated reservation with early checkout details
   */
  async processEarlyCheckout(
    id: string,
    userId: string,
    reason?: string
  ): Promise<IReservation>;

  /**
   * Modify reservation dates
   * @param id - Reservation ID
   * @param userId - User ID
   * @param newCheckIn - New check-in date (optional)
   * @param newCheckOut - New check-out date (optional)
   * @param reason - Optional modification reason
   * @returns Updated reservation
   */
  async modifyReservation(
    id: string,
    userId: string,
    newCheckIn?: Date,
    newCheckOut?: Date,
    reason?: string
  ): Promise<IReservation>;

  /**
   * Raise dispute for a reservation
   * @param id - Reservation ID
   * @param userId - User ID
   * @param disputeReason - Description of the dispute
   * @returns Updated reservation with dispute status
   */
  async raiseDispute(
    id: string,
    userId: string,
    disputeReason: string
  ): Promise<IReservation>;

  /**
   * Legacy method: cancel reservation
   * Dispatches to appropriate method based on reservation state
   */
  async cancelReservation(
    id: string,
    userId: string
  ): Promise<IReservation>;
}
```

---

## Interface: Email Service

```typescript
// backend/src/services/email.service.ts

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface CancellationEmailData {
  id: string;
  title: string;
  apartmentNumber?: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  refundAmount?: number;
  refundPercentage?: number;
  cancellationReason?: string;
}

interface EarlyCheckoutEmailData {
  id: string;
  title: string;
  apartmentNumber?: string;
  checkIn: Date;
  checkOut: Date;
  actualCheckoutDate: Date;
  totalPrice: number;
  refundAmount?: number;
  refundPercentage?: number;
  earlyCheckoutReason?: string;
}

interface DisputeEmailData {
  id: string;
  title: string;
  apartmentNumber?: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  disputeReason: string;
}

class EmailService {
  async sendCancellationConfirmationEmail(
    to: string,
    data: CancellationEmailData
  ): Promise<boolean>;

  async sendEarlyCheckoutEmail(
    to: string,
    data: EarlyCheckoutEmailData
  ): Promise<boolean>;

  async sendDisputeNotificationEmail(
    to: string,
    data: DisputeEmailData
  ): Promise<boolean>;
}
```

---

## Interface: Controller Methods

```typescript
// backend/src/controllers/reservation.controller.ts

// Utilise Express Request/Response
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

interface ReservationController {
  
  cancelReservation: (
    req: AuthRequest,
    res: Response
  ) => Promise<void>;

  requestEarlyCheckout: (
    req: AuthRequest,
    res: Response
  ) => Promise<void>;

  modifyReservation: (
    req: AuthRequest,
    res: Response
  ) => Promise<void>;

  raiseDispute: (
    req: AuthRequest,
    res: Response
  ) => Promise<void>;
}
```

---

## Types Utilitaires

```typescript
// Types de réponse API standard

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  statusCode?: number;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Refund calculation info
interface RefundInfo {
  percentage: number;   // 0-100
  amount: number;       // €
  originalAmount: number;
  reason: string;       // "72h+ before check-in", "Early checkout", etc.
}

// Reservation action details
interface ReservationAction {
  type: ActionTypeValue;
  timestamp: Date;
  reason?: string;
  refund?: RefundInfo;
}

// Timeline of reservation
interface ReservationTimeline {
  created: Date;
  confirmed?: Date;
  checkedIn?: Date;
  actions: ReservationAction[];
  completed?: Date;
}
```

---

## Usage Examples

### Dans un Composant React

```typescript
import { IReservation, CancelReservationRequest } from '../types';

const handleCancel = async (reservation: IReservation, reason: string) => {
  const payload: CancelReservationRequest = { reason };
  
  const response = await fetch(
    `/api/reservations/${reservation._id}/cancel`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error('Failed to cancel');
  }

  const result: CancelReservationResponse = await response.json();
  
  // TypeScript knows all properties now
  console.log(`Refund: €${result.refund.amount}`);
  console.log(`Status: ${result.reservation.status}`);
};
```

### Dans une Fonction Service

```typescript
import { ReservationService } from './services/reservation.service';
import { IReservation } from './models/Reservation';

const service = new ReservationService();

async function handleCancellation(
  reservationId: string,
  userId: string,
  reason: string
): Promise<IReservation> {
  
  // TypeScript vérifie que reason est string
  const updated: IReservation = 
    await service.requestCancellation(reservationId, userId, reason);
  
  // TypeScript connaît tous les champs
  console.log(`Action: ${updated.actionType}`);
  console.log(`Refund: €${updated.refundAmount}`);
  
  return updated;
}
```

### Validation avec Zod (Optionnel)

```typescript
import { z } from 'zod';

const CancelReservationSchema = z.object({
  reason: z.string().max(500).optional()
});

const EarlyCheckoutSchema = z.object({
  reason: z.string().max(500).optional()
});

const ModifyReservationSchema = z.object({
  checkIn: z.string().datetime().optional(),
  checkOut: z.string().datetime().optional(),
  reason: z.string().max(500).optional()
});

const RaiseDisputeSchema = z.object({
  disputeReason: z.string().min(10).max(1000)
});

// Usage dans middleware Express
app.post('/reservations/:id/cancel', (req, res) => {
  const validated = CancelReservationSchema.safeParse(req.body);
  
  if (!validated.success) {
    return res.status(400).json({ errors: validated.error.flatten() });
  }
  
  // validated.data est typé correctement
  const { reason } = validated.data;
  // ...
});
```

---

## Migration d'Ancien Code

### Avant:

```typescript
// Ancien code sans types
const reservation = await Reservation.findById(id);
if (reservation.status === 'confirmed') {
  reservation.status = 'cancelled';
  await reservation.save();
}
```

### Après:

```typescript
// Nouveau code avec types
import { IReservation, ReservationStatus } from './types';

const reservation: IReservation | null = 
  await Reservation.findById(id);

if (reservation && reservation.status === ReservationStatus.CONFIRMED) {
  reservation.status = ReservationStatus.CANCELLED;
  reservation.actionType = 'cancellation';
  reservation.cancellationReason = 'Automatic';
  reservation.cancellationRequestedAt = new Date();
  await reservation.save();
}
```

---

## Export pour réutilisation

### Dans `backend/src/types/reservation.types.ts`:

```typescript
export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EARLY_CHECKOUT = 'early_checkout',
  DISPUTE = 'dispute'
}

export enum ActionType {
  CANCELLATION = 'cancellation',
  EARLY_CHECKOUT = 'early_checkout',
  MODIFICATION = 'modification',
  DISPUTE_RESOLUTION = 'dispute_resolution',
  CHECKOUT = 'checkout'
}

export interface IReservation extends Document {
  // ... tous les champs
}

export interface RefundInfo {
  percentage: number;
  amount: number;
}

// ... autres interfaces
```

### Import dans autres fichiers:

```typescript
import { 
  ReservationStatus,
  ActionType,
  IReservation,
  RefundInfo 
} from '../types/reservation.types';

// Maintenant disponible partout
const status: ReservationStatus = ReservationStatus.CANCELLED;
const action: ActionType = ActionType.EARLY_CHECKOUT;
```

---

## Best Practices

✅ **DO:**
- Utiliser les enums pour les valeurs constantes
- Déclarer les interfaces pour les objets
- Utiliser `async/await` avec `Promise<T>`
- Valider les inputs avec Zod/Joi

❌ **DON'T:**
- `any` type - très mauvais
- Mélanger types et values
- Oublier les retours de fonction
- Ignorer les erreurs TypeScript

---

**Version:** 1.0
**Created:** 15 Janvier 2024
