export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  guest_id?: string;
  apartment_id: string;
  apartment_name: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests?: string;
  created_at: string;
  updated_at: string;
  guest?: Guest;
}

export interface Payment {
  id: string;
  reservation_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  payment_method?: string;
  stripe_payment_id?: string;
  stripe_customer_id?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  reservation?: Reservation;
}

export type GuestInput = Omit<Guest, 'id' | 'created_at' | 'updated_at'>;
export type ReservationInput = Omit<Reservation, 'id' | 'created_at' | 'updated_at' | 'guest'>;
export type PaymentInput = Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'reservation'>;
