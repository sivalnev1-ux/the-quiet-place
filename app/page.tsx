'use client';

import Image from 'next/image';
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
const ROOM_ICONS = ['🛏️', '💼', '🌸'];

function StatusBadge({ status }: { status: RoomStatus }) {
  const { t } = useLang();
  const map: Record<RoomStatus, { label: string; className: string }> = {
    free: { label: t.free, className: 'bg-emerald-100 text-emerald-700' },
    busy: { label: t.busy, className: 'bg-red-100 text-red-600' },
    partial: { label: t.partial, className: 'bg-amber-100 text-amber-700' },
  };
  const { label, className } = map[status];
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${className}`}>
      {label}
    </span>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [rooms] = useRooms();
  const [bookings] = useBookings();
  const [blocks] = useBlocks();

  const ROOM_NAMES = [t.room1Name, t.room2Name, t.room3Name];
  const ROOM_DESCS = [t.room1Desc, t.room2Desc, t.room3Desc];
  const activeRooms = rooms.filter((r) => r.is_active);

  return (
    <main className="min-h-screen bg-[#F6F2E8]">
      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="bg-[#10362D] text-white px-6 pt-10 pb-12 relative overflow-hidden">
        {/* Фоновый декор */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B08A3B] opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#B08A3B] opacity-5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        {/* Lang switcher */}
        <div className="max-w-md mx-auto flex justify-end mb-6 relative">
          <LangSwitcher />
        </div>

        {/* Логотип горизонтальный */}
        <div className="max-w-md mx-auto mb-8 relative flex justify-center">
          <Image
            src="/logo-horizontal.svg"
            alt="The Quiet Place"
            width={420}
            height={100}
            priority
            className="w-full max-w-sm"
          />
        </div>

        <div className="max-w-md mx-auto relative">
          {/* Золотая линия-разделитель */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#B08A3B] opacity-40" />
            <span className="text-[#B08A3B] text-xs tracking-[0.25em] uppercase opacity-80">
              {t.hotelTagline1} · {t.hotelTagline2}
            </span>
            <div className="flex-1 h-px bg-[#B08A3B] opacity-40" />
          </div>

          <p className="text-white/60 text-sm leading-relaxed mb-8 text-center">
            {t.hotelDescription}
          </p>

          <button
            onClick={() => router.push('/booking')}
            className="w-full bg-[#B08A3B] hover:bg-[#8a6a28] active:bg-[#6e5420] text-white py-4 rounded-2xl font-semibold text-base transition-colors shadow-lg shadow-[#B08A3B]/30"
          >
            {t.bookNow}
          </button>
          <button
            onClick={() => router.push('/rooms')}
            className="w-full mt-3 border border-white/20 text-white/60 hover:text-white hover:border-white/40 py-3.5 rounded-2xl font-medium text-sm transition-colors"
          >
            {t.viewAllRooms}
          </button>
        </div>
      </div>

      {/* ── Rooms ───────────────────────────────────────────── */}
      <div className="px-4 py-8 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#10362D]">{t.ourRooms}</h2>
          <span className="text-sm text-[#9B9B9B]">{activeRooms.length} {t.rooms}</span>
        </div>

        <div className="space-y-4">
          {activeRooms.map((room, idx) => {
            const status = getRoomStatus(room.id, bookings, blocks);
            return (
              <div
                key={room.id}
                onClick={() => router.push(`/booking?room=${room.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#DED6C4] cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`h-36 bg-gradient-to-br ${ROOM_GRADIENTS[idx]} flex items-end justify-between p-4`}>
                  <span className="text-4xl">{ROOM_ICONS[idx]}</span>
                  <StatusBadge status={status} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#10362D] mb-1">{ROOM_NAMES[idx]}</h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed mb-3">{ROOM_DESCS[idx]}</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[#B08A3B] font-bold">{room.price_per_night.toLocaleString()} ₪</span>
                      <span className="text-[#9B9B9B] text-xs ml-1">/{lang === 'he' ? 'לילה' : lang === 'ru' ? 'ночь' : 'night'}</span>
                    </div>
                    <div className="w-px h-4 bg-[#DED6C4]" />
                    <div>
                      <span className="text-[#6B6B6B] font-medium">{room.price_per_hour.toLocaleString()} ₪</span>
                      <span className="text-[#9B9B9B] text-xs ml-1">/{lang === 'he' ? 'שעה' : lang === 'ru' ? 'час' : 'hr'}</span>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[#B08A3B] text-sm font-medium">{t.selectRoom}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="pb-10 text-center">
        <div className="w-16 h-px bg-[#DED6C4] mx-auto mb-4" />
        <button onClick={() => router.push('/admin')} className="text-xs text-[#B08A3B] hover:text-[#10362D] transition-colors opacity-50 hover:opacity-100">
          {t.management}
        </button>
      </div>
    </main>
  );
}
