export type BookingType = 'hourly' | 'nightly';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type RoomStatus = 'free' | 'busy' | 'partial';

export interface Room {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_per_hour: number;
  price_per_night: number;
  is_active: boolean;
}

export interface Booking {
  id: string;
  booking_number: string;
  room_id: string;
  customer_name: string;
  customer_phone: string;
  booking_type: BookingType;
  start_datetime: string; // ISO string
  end_datetime: string;   // ISO string
  total_price: number;
  status: BookingStatus;
  notes: string;
  created_at: string; // ISO string
}

export interface RoomBlock {
  id: string;
  room_id: string;
  start_datetime: string;
  end_datetime: string;
  reason: string;
}

export interface Settings {
  cleaning_buffer_minutes: number;
  whatsapp_number: string;
  currency: string;
}
