'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRooms, useBookings, useBlocks, useSettings, saveLastBooking } from '@/lib/store';
import { checkAvailability, calculatePrice, generateBookingNumber, generateId } from '@/lib/bookingLogic';
import { useLang } from '@/lib/langContext';
import LangSwitcher from '@/components/LangSwitcher';
import type { Booking } from '@/lib/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function today() { return new Date(); }
function tomorrow() { const d = new Date(); d.setDate(d.getDate() + 1); return d; }
function dateTimeStr(date: Date, hours: number, minutes: number): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}T${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:00`;
}
function combineDatetime(date: Date, timeDate: Date): string {
  return dateTimeStr(date, timeDate.getHours(), timeDate.getMinutes());
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );
}

function InputField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-xl border border-[#DED6C4] bg-white text-[#10362D] placeholder-[#C0B8A8] focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40 focus:border-[#B08A3B] transition-colors text-sm ${props.className ?? ''}`}
    />
  );
}

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedRoomId = searchParams.get('room') ?? '';
  const { t, lang } = useLang();

  const [rooms] = useRooms();
  const [bookings, setBookings] = useBookings();
  const [blocks] = useBlocks();
  const [settings] = useSettings();

  const [roomId, setRoomId] = useState(preSelectedRoomId);
  const [bookingType, setBookingType] = useState<'nightly' | 'hourly'>('nightly');
  const [nightlyStart, setNightlyStart] = useState<Date>(today());
  const [nightlyEnd, setNightlyEnd] = useState<Date>(tomorrow());
  const [hourlyDate, setHourlyDate] = useState<Date>(today());
  const [hourlyStartTime, setHourlyStartTime] = useState<Date>(() => { const d = new Date(); d.setHours(10, 0, 0, 0); return d; });
  const [hourlyEndTime, setHourlyEndTime] = useState<Date>(() => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const ROOM_NAMES = [t.room1Name, t.room2Name, t.room3Name];
  const selectedRoom = rooms.find((r) => r.id === roomId);
  const activeRooms = rooms.filter((r) => r.is_active);

  const getDatetimes = useCallback(() => {
    if (bookingType === 'nightly') {
      return { start: dateTimeStr(nightlyStart, 14, 0), end: dateTimeStr(nightlyEnd, 12, 0) };
    }
    return { start: combineDatetime(hourlyDate, hourlyStartTime), end: combineDatetime(hourlyDate, hourlyEndTime) };
  }, [bookingType, nightlyStart, nightlyEnd, hourlyDate, hourlyStartTime, hourlyEndTime]);

  useEffect(() => {
    if (!selectedRoom) { setTotalPrice(0); setIsAvailable(null); return; }
    const { start, end } = getDatetimes();
    if (!start || !end || new Date(start) >= new Date(end)) { setTotalPrice(0); setIsAvailable(null); return; }
    setTotalPrice(calculatePrice(bookingType, start, end, selectedRoom.price_per_hour, selectedRoom.price_per_night));
    setIsAvailable(checkAvailability(roomId, start, end, bookings, blocks, undefined, settings.cleaning_buffer_minutes));
    setError('');
  }, [roomId, bookingType, getDatetimes, selectedRoom, bookings, blocks, settings.cleaning_buffer_minutes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!roomId) { setError(t.errorChooseRoom); return; }
    if (!name.trim()) { setError(t.errorEnterName); return; }
    if (!phone.trim()) { setError(t.errorEnterPhone); return; }
    const { start, end } = getDatetimes();
    if (new Date(start) >= new Date(end)) { setError(t.errorEndAfterStart); return; }
    if (!isAvailable) { setError(t.errorSlotTaken); return; }
    setSubmitting(true);
    const finalCheck = checkAvailability(roomId, start, end, bookings, blocks, undefined, settings.cleaning_buffer_minutes);
    if (!finalCheck) { setError(t.errorRaceCondition); setIsAvailable(false); setSubmitting(false); return; }
    const newBooking: Booking = {
      id: generateId(),
      booking_number: generateBookingNumber(bookings),
      room_id: roomId,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      booking_type: bookingType,
      start_datetime: start,
      end_datetime: end,
      total_price: totalPrice,
      status: 'pending',
      notes: notes.trim(),
      created_at: new Date().toISOString(),
    };
    setBookings((prev) => [...prev, newBooking]);
    saveLastBooking(newBooking);
    setSubmitting(false);
    router.push(`/confirmation?id=${newBooking.id}`);
  }

  const icons = ['🛏', '💼', '🌸'];

  return (
    <main className="min-h-screen bg-[#F6F2E8] pb-10">
      <div className="bg-[#10362D] text-white px-4 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" aria-label="back">←</button>
            <img src="/logo-emblem.svg" alt="The Quiet Place" className="h-10 w-auto" />
          </div>
          <LangSwitcher />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 pt-6 space-y-5">
        {/* Room selection */}
        <section className="bg-white rounded-2xl p-5 border border-[#DED6C4]">
          <h2 className="text-sm font-semibold text-[#2D2D2D] mb-4">{t.room}</h2>
          <div className="space-y-2">
            {activeRooms.map((room, idx) => (
              <label
                key={room.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${roomId === room.id ? 'border-[#B08A3B] bg-[#FFF9EE]' : 'border-[#DED6C4] hover:border-[#B08A3B]/40'}`}
              >
                <input type="radio" name="room" value={room.id} checked={roomId === room.id} onChange={() => setRoomId(room.id)} className="sr-only" />
                <span className="text-2xl">{icons[idx]}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm text-[#10362D]">{ROOM_NAMES[idx]}</p>
                  <p className="text-xs text-[#9B9B9B]">{room.price_per_night.toLocaleString()} ₪/{lang === 'he' ? 'לילה' : lang === 'ru' ? 'ночь' : 'night'} · {room.price_per_hour.toLocaleString()} ₪/{lang === 'he' ? 'שעה' : lang === 'ru' ? 'час' : 'hr'}</p>
                </div>
                {roomId === room.id && <span className="text-[#B08A3B] text-lg">✓</span>}
              </label>
            ))}
          </div>
        </section>

        {/* Booking type */}
        <section className="bg-white rounded-2xl p-5 border border-[#DED6C4]">
          <h2 className="text-sm font-semibold text-[#10362D] mb-4">{t.bookingType}</h2>
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F6F2E8] rounded-xl">
            {(['nightly', 'hourly'] as const).map((type) => (
              <button key={type} type="button" onClick={() => setBookingType(type)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${bookingType === type ? 'bg-white text-[#2D2D2D] shadow-sm' : 'text-[#9B9B9B] hover:text-[#6B6B6B]'}`}>
                {type === 'nightly' ? t.perNightType : t.perHourType}
              </button>
            ))}
          </div>
        </section>

        {/* Date / time */}
        <section className="bg-white rounded-2xl p-5 border border-[#DED6C4]">
          <h2 className="text-sm font-semibold text-[#10362D] mb-4">{t.dateAndTime}</h2>
          {bookingType === 'nightly' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>{t.arrival}</FieldLabel>
                <DatePicker
                  selected={nightlyStart}
                  onChange={(date: Date | null) => {
                    if (!date) return;
                    setNightlyStart(date);
                    if (date >= nightlyEnd) {
                      const next = new Date(date);
                      next.setDate(next.getDate() + 1);
                      setNightlyEnd(next);
                    }
                  }}
                  minDate={today()}
                  dateFormat="dd/MM/yyyy"
                  wrapperClassName="w-full"
                  className="w-full px-4 py-3 rounded-xl border border-[#DED6C4] bg-white text-[#10362D] focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40 focus:border-[#B08A3B] transition-colors text-sm cursor-pointer"
                  popperPlacement="bottom-start"
                />
                <p className="text-xs text-[#9B9B9B] mt-1">{t.from14}</p>
              </div>
              <div>
                <FieldLabel>{t.departure}</FieldLabel>
                <DatePicker
                  selected={nightlyEnd}
                  onChange={(date: Date | null) => { if (date) setNightlyEnd(date); }}
                  minDate={nightlyStart}
                  dateFormat="dd/MM/yyyy"
                  wrapperClassName="w-full"
                  className="w-full px-4 py-3 rounded-xl border border-[#DED6C4] bg-white text-[#10362D] focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40 focus:border-[#B08A3B] transition-colors text-sm cursor-pointer"
                  popperPlacement="bottom-start"
                />
                <p className="text-xs text-[#9B9B9B] mt-1">{t.until12}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <FieldLabel>{t.date}</FieldLabel>
                <DatePicker
                  selected={hourlyDate}
                  onChange={(date: Date | null) => { if (date) setHourlyDate(date); }}
                  minDate={today()}
                  dateFormat="dd/MM/yyyy"
                  wrapperClassName="w-full"
                  className="w-full px-4 py-3 rounded-xl border border-[#DED6C4] bg-white text-[#10362D] focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40 focus:border-[#B08A3B] transition-colors text-sm cursor-pointer"
                  popperPlacement="bottom-start"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>{t.start}</FieldLabel>
                  <DatePicker
                    selected={hourlyStartTime}
                    onChange={(date: Date | null) => { if (date) setHourlyStartTime(date); }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeFormat="HH:mm"
                    dateFormat="HH:mm"
                    wrapperClassName="w-full"
                    className="w-full px-4 py-3 rounded-xl border border-[#DED6C4] bg-white text-[#10362D] focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40 focus:border-[#B08A3B] transition-colors text-sm cursor-pointer"
                  />
                </div>
                <div>
                  <FieldLabel>{t.end}</FieldLabel>
                  <DatePicker
                    selected={hourlyEndTime}
                    onChange={(date: Date | null) => { if (date) setHourlyEndTime(date); }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeFormat="HH:mm"
                    dateFormat="HH:mm"
                    wrapperClassName="w-full"
                    className="w-full px-4 py-3 rounded-xl border border-[#DED6C4] bg-white text-[#10362D] focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40 focus:border-[#B08A3B] transition-colors text-sm cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Price / availability */}
        {selectedRoom && totalPrice > 0 && (
          <section className={`rounded-2xl p-4 border-2 ${isAvailable === false ? 'border-red-200 bg-red-50' : isAvailable === true ? 'border-emerald-200 bg-emerald-50' : 'border-[#E8E0D0] bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B6B6B] mb-0.5">{t.totalToPay}</p>
                <p className="text-2xl font-bold text-[#2D2D2D]">{totalPrice.toLocaleString()} ₪</p>
              </div>
              {isAvailable === true && <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium"><span>✓</span> {t.available}</div>}
              {isAvailable === false && <div className="flex items-center gap-1.5 text-red-500 text-sm font-medium"><span>✗</span> {t.unavailable}</div>}
            </div>
          </section>
        )}

        {/* Customer data */}
        <section className="bg-white rounded-2xl p-5 border border-[#DED6C4]">
          <h2 className="text-sm font-semibold text-[#10362D] mb-4">{t.yourData}</h2>
          <div className="space-y-3">
            <div>
              <FieldLabel>{t.nameLabel} *</FieldLabel>
              <InputField type="text" placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <FieldLabel>{t.phoneLabel} *</FieldLabel>
              <InputField type="tel" placeholder={t.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <FieldLabel>{t.comment}</FieldLabel>
              <textarea placeholder={t.commentPlaceholder} value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#DED6C4] bg-white text-[#10362D] placeholder-[#C0B8A8] focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40 focus:border-[#B08A3B] transition-colors text-sm resize-none" />
            </div>
          </div>
        </section>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}

        <button type="submit" disabled={submitting || isAvailable === false}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-colors ${submitting || isAvailable === false ? 'bg-[#DED6C4] text-[#9B9B9B] cursor-not-allowed' : 'bg-[#B08A3B] hover:bg-[#8a6a28] active:bg-[#6e5420] text-white shadow-lg shadow-[#B08A3B]/20'}`}>
          {submitting ? t.processing : t.confirmBooking}
        </button>

        <p className="text-xs text-center text-[#9B9B9B] pb-4">{t.bookingNote}</p>
      </form>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F2E8] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#B08A3B] border-t-transparent rounded-full animate-spin" /></div>}>
      <BookingFormContent />
    </Suspense>
  );
}
