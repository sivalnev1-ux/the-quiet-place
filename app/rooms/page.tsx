'use client';

import { useRouter } from 'next/navigation';
import { useRooms, useBookings, useBlocks } from '@/lib/store';
import { getRoomStatus } from '@/lib/bookingLogic';
import { useLang } from '@/lib/langContext';
import LangSwitcher from '@/components/LangSwitcher';
import type { RoomStatus } from '@/lib/types';

const ROOM_GRADIENTS = [
  'from-[#10362D] to-[#1a5044]',
  'from-[#2C3E2D] to-[#4a6741]',
  'from-[#2D2820] to-[#5C4A2A]',
];
const ROOM_ICONS = ['??', '??', '??'];

function StatusBadge({ status }: { status: RoomStatus }) {
  const { t } = useLang();
  const map: Record<RoomStatus, { label: string; className: string }> = {
    free: { label: t.free, className: 'bg-emerald-100 text-emerald-700' },
    busy: { label: t.busyNow, className: 'bg-red-100 text-red-600' },
    partial: { label: t.hasBookings, className: 'bg-amber-100 text-amber-700' },
  };
  const { label, className } = map[status];
  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium ${className}`}>
      {label}
    </span>
  );
}

function StatusDot({ status }: { status: RoomStatus }) {
  const colors: Record<RoomStatus, string> = {
    free: 'bg-emerald-400',
    busy: 'bg-red-400',
    partial: 'bg-amber-400',
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${colors[status]} mr-1.5`} />
  );
}

export default function RoomsPage() {
  const router = useRouter();
  const { t } = useLang();
  const [rooms] = useRooms();
  const [bookings] = useBookings();
  const [blocks] = useBlocks();

  const ROOM_NAMES = [t.room1Name, t.room2Name, t.room3Name];
  const ROOM_DESCS = [t.room1Desc, t.room2Desc, t.room3Desc];

  const activeRooms = rooms.filter((r) => r.is_active);

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="bg-[#10362D] text-white px-4 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
              aria-label="back"
            >
              ←
            </button>
            <img src="/logo-emblem.svg" alt="The Quiet Place" className="h-10 w-auto" />
          </div>
          <LangSwitcher />
        </div>
      </div>

      {/* Rooms */}
      <div className="px-4 py-6 max-w-md mx-auto space-y-5">
        {activeRooms.map((room, idx) => {
          const status = getRoomStatus(room.id, bookings, blocks);
          const isAvailable = status !== 'busy';

          return (
            <div
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#DED6C4] animate-fade-in"
            >
              <div
                className={`relative h-48 bg-gradient-to-br ${ROOM_GRADIENTS[idx]} flex items-center justify-center`}
              >
                <span className="text-6xl opacity-40">{ROOM_ICONS[idx]}</span>
                <div className="absolute top-3 left-3">
                  <StatusBadge status={status} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white font-bold text-xl">
                  {ROOM_NAMES[idx]}
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">
                  {ROOM_DESCS[idx]}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#F6F2E8] rounded-xl p-3">
                    <p className="text-[#9B9B9B] text-xs mb-1">{t.perNight}</p>
                    <p className="text-[#10362D] font-bold text-lg">
                      {room.price_per_night.toLocaleString()}{' '}
                      <span className="text-sm font-normal text-[#B08A3B]">₪</span>
                    </p>
                    <p className="text-[#9B9B9B] text-xs">{t.checkIn} / {t.checkOut}</p>
                  </div>
                  <div className="bg-[#F6F2E8] rounded-xl p-3">
                    <p className="text-[#9B9B9B] text-xs mb-1">{t.perHour}</p>
                    <p className="text-[#10362D] font-bold text-lg">
                      {room.price_per_hour.toLocaleString()}{' '}
                      <span className="text-sm font-normal text-[#B08A3B]">₪</span>
                    </p>
                    <p className="text-[#9B9B9B] text-xs">{t.minOneHour}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4 text-sm text-[#6B6B6B]">
                  <StatusDot status={status} />
                  {status === 'free' && t.freeToday}
                  {status === 'busy' && t.busyNow}
                  {status === 'partial' && t.hasBookings}
                </div>

                <button
                  onClick={() => isAvailable && router.push(`/booking?room=${room.id}`)}
                  disabled={!isAvailable}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-colors ${
                    isAvailable
                      ? 'bg-[#10362D] text-white hover:bg-[#1a5044] active:bg-[#0a2018]'
                      : 'bg-[#DED6C4] text-[#9B9B9B] cursor-not-allowed'
                  }`}
                >
                  {isAvailable ? t.selectAndBook : t.busyNowBtn}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom brand divider */}
      <div className="py-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 w-full max-w-xs px-4">
          <div className="flex-1 h-px bg-[#B08A3B]" />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C8 0 6.5 2.5 6.5 4.5C6.5 5.88 7.12 6.5 8 6.5C8.88 6.5 9.5 5.88 9.5 4.5C9.5 2.5 8 0 8 0Z" fill="#B08A3B"/>
            <path d="M8 6.5C8 6.5 5 6 3.5 7.5C2.5 8.5 2.5 10 3.5 10.5C4.5 11 5.5 10 5.5 10C5.5 10 5 12 6 13C6.7 13.7 7.4 13.5 8 13C8.6 13.5 9.3 13.7 10 13C11 12 10.5 10 10.5 10C10.5 10 11.5 11 12.5 10.5C13.5 10 13.5 8.5 12.5 7.5C11 6 8 6.5 8 6.5Z" fill="#B08A3B"/>
            <path d="M8 13V16" stroke="#B08A3B" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <div className="flex-1 h-px bg-[#B08A3B]" />
        </div>
        <p className="text-[#10362D] tracking-[0.25em] text-xs font-semibold uppercase">The Quiet Place</p>
        <p className="text-[#B08A3B] tracking-[0.2em] text-[10px] uppercase">Logo System</p>
      </div>
    </main>
  );
}
