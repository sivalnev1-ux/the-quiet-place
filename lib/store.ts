'use client';

import { useState, useEffect, useCallback } from 'react';
import { Booking, Room, RoomBlock, Settings } from './types';
import { MOCK_ROOMS, MOCK_BOOKINGS, MOCK_BLOCKS, DEFAULT_SETTINGS } from './mockData';

// ---------------------------------------------------------------------------
// Generic localStorage hook
// ---------------------------------------------------------------------------
function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(defaultValue);

  // Инициализируем из localStorage после монтирования (избегаем SSR-проблем)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored) as T);
      } else {
        // Первый запуск — сохраняем дефолтные значения
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    } catch {
      // Если localStorage недоступен — работаем с in-memory state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const newValue =
          typeof value === 'function'
            ? (value as (prev: T) => T)(prev)
            : value;
        try {
          localStorage.setItem(key, JSON.stringify(newValue));
        } catch {
          // ignore write errors
        }
        return newValue;
      });
    },
    [key],
  );

  return [state, setValue];
}

// ---------------------------------------------------------------------------
// Public hooks — используй в компонентах
// ---------------------------------------------------------------------------

export function useRooms() {
  return useLocalStorage<Room[]>('hotel_rooms', MOCK_ROOMS);
}

export function useBookings() {
  return useLocalStorage<Booking[]>('hotel_bookings', MOCK_BOOKINGS);
}

export function useBlocks() {
  return useLocalStorage<RoomBlock[]>('hotel_blocks', MOCK_BLOCKS);
}

export function useSettings() {
  return useLocalStorage<Settings>('hotel_settings', DEFAULT_SETTINGS);
}

// ---------------------------------------------------------------------------
// Хелпер для сохранения/чтения последней брони между страницами
// ---------------------------------------------------------------------------

export function saveLastBooking(booking: Booking) {
  try {
    localStorage.setItem('hotel_last_booking', JSON.stringify(booking));
  } catch {
    // ignore
  }
}

export function loadLastBooking(): Booking | null {
  try {
    const stored = localStorage.getItem('hotel_last_booking');
    return stored ? (JSON.parse(stored) as Booking) : null;
  } catch {
    return null;
  }
}
