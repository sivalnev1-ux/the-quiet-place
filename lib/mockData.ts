import { Room, Booking, RoomBlock, Settings } from './types';

// Room names/descriptions are translated on render via i18n
// Prices are in ILS (₪ shekels)
export const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    name: 'Room 1',
    description: '',
    image_url: '',
    price_per_hour: 80,
    price_per_night: 450,
    is_active: true,
  },
  {
    id: '2',
    name: 'Room 2',
    description: '',
    image_url: '',
    price_per_hour: 120,
    price_per_night: 650,
    is_active: true,
  },
  {
    id: '3',
    name: 'Room 3',
    description: '',
    image_url: '',
    price_per_hour: 100,
    price_per_night: 550,
    is_active: true,
  },
];

// Несколько примеров броней чтобы продемонстрировать систему
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

const todayStr = new Date().toISOString().split('T')[0];
const tomorrowStr = tomorrow.toISOString().split('T')[0];
const datStr = dayAfterTomorrow.toISOString().split('T')[0];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b-demo-1',
    booking_number: 'BK-001',
    room_id: '2',
    customer_name: 'Алексей Петров',
    customer_phone: '+7 900 123 45 67',
    booking_type: 'nightly',
    start_datetime: `${tomorrowStr}T14:00:00`,
    end_datetime: `${datStr}T12:00:00`,
    total_price: 650,
    status: 'confirmed',
    notes: 'Прошу приготовить комнату к 13:00',
    created_at: new Date().toISOString(),
  },
  {
    id: 'b-demo-2',
    booking_number: 'BK-002',
    room_id: '1',
    customer_name: 'Мария Соколова',
    customer_phone: '+7 911 987 65 43',
    booking_type: 'hourly',
    start_datetime: `${todayStr}T10:00:00`,
    end_datetime: `${todayStr}T14:00:00`,
    total_price: 320,
    status: 'completed',
    notes: '',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const MOCK_BLOCKS: RoomBlock[] = [];

export const DEFAULT_SETTINGS: Settings = {
  cleaning_buffer_minutes: 30,
  whatsapp_number: '+972501234567',
  currency: '₪',
};
