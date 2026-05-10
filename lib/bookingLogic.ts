import { Booking, RoomBlock, RoomStatus } from './types';

/**
 * Проверяет доступность комнаты для указанного временного слота.
 * Учитывает буфер для уборки между бронями.
 * 
 * Формула пересечения: existing.start < new.end AND existing.end > new.start
 */
export function checkAvailability(
  roomId: string,
  startDatetime: string,
  endDatetime: string,
  bookings: Booking[],
  blocks: RoomBlock[],
  excludeBookingId?: string,
  bufferMinutes = 30,
): boolean {
  const newStart = new Date(startDatetime).getTime();
  const newEnd = new Date(endDatetime).getTime();

  if (newStart >= newEnd) return false;

  const bufferMs = bufferMinutes * 60 * 1000;

  // Проверяем пересечение с активными бронями
  const activeBookings = bookings.filter(
    (b) =>
      b.room_id === roomId &&
      b.id !== excludeBookingId &&
      (b.status === 'pending' || b.status === 'confirmed'),
  );

  for (const booking of activeBookings) {
    // Расширяем существующую бронь на буфер с обеих сторон
    const existingStart = new Date(booking.start_datetime).getTime() - bufferMs;
    const existingEnd = new Date(booking.end_datetime).getTime() + bufferMs;

    if (existingStart < newEnd && existingEnd > newStart) {
      return false;
    }
  }

  // Проверяем пересечение с блокировками
  const roomBlocks = blocks.filter((b) => b.room_id === roomId);
  for (const block of roomBlocks) {
    const blockStart = new Date(block.start_datetime).getTime();
    const blockEnd = new Date(block.end_datetime).getTime();

    if (blockStart < newEnd && blockEnd > newStart) {
      return false;
    }
  }

  return true;
}

/**
 * Определяет текущий статус комнаты на сегодня.
 */
export function getRoomStatus(
  roomId: string,
  bookings: Booking[],
  blocks: RoomBlock[],
): RoomStatus {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const activeBookings = bookings.filter(
    (b) =>
      b.room_id === roomId &&
      (b.status === 'pending' || b.status === 'confirmed'),
  );

  const todayBookings = activeBookings.filter((b) => {
    const start = new Date(b.start_datetime);
    const end = new Date(b.end_datetime);
    return start < todayEnd && end > todayStart;
  });

  const activeBlocks = blocks.filter((b) => {
    if (b.room_id !== roomId) return false;
    const start = new Date(b.start_datetime);
    const end = new Date(b.end_datetime);
    return start < todayEnd && end > todayStart;
  });

  if (todayBookings.length === 0 && activeBlocks.length === 0) return 'free';

  // Занято прямо сейчас
  const nowBusy =
    activeBookings.some((b) => {
      const start = new Date(b.start_datetime);
      const end = new Date(b.end_datetime);
      return start <= now && end >= now;
    }) ||
    activeBlocks.some((b) => {
      const start = new Date(b.start_datetime);
      const end = new Date(b.end_datetime);
      return start <= now && end >= now;
    });

  return nowBusy ? 'busy' : 'partial';
}

/**
 * Вычисляет стоимость брони.
 */
export function calculatePrice(
  bookingType: 'hourly' | 'nightly',
  startDatetime: string,
  endDatetime: string,
  pricePerHour: number,
  pricePerNight: number,
): number {
  const start = new Date(startDatetime).getTime();
  const end = new Date(endDatetime).getTime();
  const diffMs = end - start;

  if (diffMs <= 0) return 0;

  if (bookingType === 'nightly') {
    const nights = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    return Math.max(1, nights) * pricePerNight;
  } else {
    const hours = Math.ceil(diffMs / (60 * 60 * 1000));
    return Math.max(1, hours) * pricePerHour;
  }
}

/**
 * Генерирует уникальный номер брони.
 */
export function generateBookingNumber(existingBookings: Booking[]): string {
  const nextNum = existingBookings.length + 1;
  return `BK-${String(nextNum).padStart(3, '0')}`;
}

/**
 * Генерирует уникальный UUID v4.
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Форматирует дату и время для отображения.
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
