'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useRooms, useBookings, useBlocks, useSettings } from '@/lib/store';
import { checkAvailability, calculatePrice, generateBookingNumber, generateId, formatDateTime, formatDate } from '@/lib/bookingLogic';
import { useLang } from '@/lib/langContext';
import LangSwitcher from '@/components/LangSwitcher';
import type { Booking, BookingStatus, RoomBlock } from '@/lib/types';
import type { Translations } from '@/lib/i18n';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'admin1234';

function StatusPill({ status, t }: { status: BookingStatus; t: Translations }) {
  const map: Record<BookingStatus, { label: string; className: string }> = {
    pending: { label: t.pending, className: 'bg-amber-100 text-amber-700' },
    confirmed: { label: t.confirm, className: 'bg-emerald-100 text-emerald-700' },
    cancelled: { label: t.cancel, className: 'bg-red-100 text-red-600' },
    completed: { label: t.complete, className: 'bg-slate-100 text-slate-600' },
  };
  const { label, className } = map[status];
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${className}`}>{label}</span>;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DED6C4] p-4">
      <p className="text-xs text-[#9B9B9B] mb-1">{label}</p>
      <p className="text-xl font-bold text-[#10362D]">{value}</p>
      {sub && <p className="text-xs text-[#9B9B9B] mt-0.5">{sub}</p>}
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useLang();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { onLogin(); }
    else { setError(t.adminWrongPass); setPassword(''); }
  }

  return (
    <div className="min-h-screen bg-[#10362D] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <img src="/logo-icon.svg" alt="The Quiet Place" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-white text-xl font-semibold">{t.adminTitle}</h1>
          <p className="text-[#B08A3B] text-sm mt-1 tracking-widest uppercase opacity-70">The Quiet Place</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="password" placeholder={t.adminPassword} value={password} onChange={(e) => setPassword(e.target.value)} autoFocus
            className="w-full px-4 py-3.5 rounded-xl bg-[#3D3D3D] border border-[#4D4D4D] text-white placeholder-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40 focus:border-[#B08A3B] text-sm" />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button type="submit" className="w-full bg-[#B08A3B] hover:bg-[#8a6a28] text-white py-3.5 rounded-xl font-semibold text-sm transition-colors">{t.adminLogin}</button>
        </form>
        <div className="mt-6 flex justify-center"><LangSwitcher /></div>
      </div>
    </div>
  );
}

function AddBookingModal({ rooms, bookings, blocks, settings, onSave, onClose }: {
  rooms: ReturnType<typeof useRooms>[0]; bookings: Booking[]; blocks: RoomBlock[];
  settings: ReturnType<typeof useSettings>[0]; onSave: (b: Booking) => void; onClose: () => void;
}) {
  const { t } = useLang();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })();
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');
  const [type, setType] = useState<'nightly' | 'hourly'>('nightly');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('12:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<BookingStatus>('confirmed');
  const [error, setError] = useState('');

  const ROOM_NAMES = [t.room1Name, t.room2Name, t.room3Name];
  const start = type === 'nightly' ? `${startDate}T14:00:00` : `${startDate}T${startTime}:00`;
  const end = type === 'nightly' ? `${endDate}T12:00:00` : `${startDate}T${endTime}:00`;
  const selectedRoom = rooms.find((r) => r.id === roomId);
  const price = selectedRoom && new Date(start) < new Date(end)
    ? calculatePrice(type, start, end, selectedRoom.price_per_hour, selectedRoom.price_per_night) : 0;

  const STATUS_LABELS: Record<BookingStatus, string> = {
    pending: t.pending, confirmed: t.confirm, cancelled: t.cancel, completed: t.complete,
  };

  function handleSave(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (!name.trim() || !phone.trim()) { setError(t.fillNamePhone); return; }
    if (new Date(start) >= new Date(end)) { setError(t.endAfterStart); return; }
    if (status !== 'cancelled' && !checkAvailability(roomId, start, end, bookings, blocks, undefined, settings.cleaning_buffer_minutes)) { setError(t.slotTaken); return; }
    onSave({ id: generateId(), booking_number: generateBookingNumber(bookings), room_id: roomId, customer_name: name.trim(), customer_phone: phone.trim(), booking_type: type, start_datetime: start, end_datetime: end, total_price: price, status, notes: notes.trim(), created_at: new Date().toISOString() });
  }

  const iLabel = 'block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5';
  const iClass = 'w-full px-3 py-2.5 rounded-xl border border-[#DED6C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#DED6C4] px-5 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-[#10362D]">{t.addBooking.replace('+ ', '')}</h3>
          <button onClick={onClose} className="text-[#9B9B9B] text-xl hover:text-[#10362D]">✕</button>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className={iLabel}>{t.room}</label>
            <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className={iClass.replace('py-2.5', 'py-3')}>
              {rooms.map((r, idx) => <option key={r.id} value={r.id}>{ROOM_NAMES[idx]}</option>)}
            </select>
          </div>
          <div>
            <label className={iLabel}>{t.typeLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              {(['nightly', 'hourly'] as const).map((tp) => (
                <button key={tp} type="button" onClick={() => setType(tp)}
                  className={`py-2 rounded-xl text-sm font-medium border-2 transition-colors ${type === tp ? 'border-[#B08A3B] bg-[#FFF9EE] text-[#10362D]' : 'border-[#DED6C4] text-[#9B9B9B]'}`}>
                  {tp === 'nightly' ? t.perNightType : t.perHourType}
                </button>
              ))}
            </div>
          </div>
          {type === 'nightly' ? (
            <div className="grid grid-cols-2 gap-3">
              <div><label className={iLabel}>{t.arrivalLabel}</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={iClass} /></div>
              <div><label className={iLabel}>{t.departureLabel}</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={iClass} /></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div><label className={iLabel}>{t.date}</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={iClass} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={iLabel}>{t.startLabel}</label><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={iClass} /></div>
                <div><label className={iLabel}>{t.endLabel}</label><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={iClass} /></div>
              </div>
            </div>
          )}
          <div>
            <label className={iLabel}>{t.statusLabel}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as BookingStatus)} className={iClass.replace('py-2.5', 'py-3')}>
              {(Object.keys(STATUS_LABELS) as BookingStatus[]).map((k) => <option key={k} value={k}>{STATUS_LABELS[k]}</option>)}
            </select>
          </div>
          <div><label className={iLabel}>{t.nameLabel} *</label><input type="text" placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} className={iClass.replace('py-2.5', 'py-3')} required /></div>
          <div><label className={iLabel}>{t.phoneLabel} *</label><input type="tel" placeholder={t.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} className={iClass.replace('py-2.5', 'py-3')} required /></div>
          <div>
            <label className={iLabel}>{t.noteLabel}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={`${iClass.replace('py-2.5', 'py-3')} resize-none`} />
          </div>
          {price > 0 && (
            <div className="bg-[#F6F2E8] rounded-xl p-3 flex justify-between items-center">
              <span className="text-sm text-[#6B6B6B]">{t.totalLabel}</span>
              <span className="font-bold text-[#10362D]">{price.toLocaleString()} ₪</span>
            </div>
          )}
          {error && <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={onClose} className="py-3 rounded-xl border border-[#DED6C4] text-sm text-[#6B6B6B]">{t.cancelBtn}</button>
            <button type="submit" className="py-3 rounded-xl bg-[#B08A3B] hover:bg-[#8a6a28] text-white text-sm font-semibold">{t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BlockRoomModal({ rooms, onSave, onClose }: { rooms: ReturnType<typeof useRooms>[0]; onSave: (b: RoomBlock) => void; onClose: () => void; }) {
  const { t } = useLang();
  const ROOM_NAMES = [t.room1Name, t.room2Name, t.room3Name];
  const today = new Date().toISOString().split('T')[0];
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState('00:00');
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState('23:59');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const iClass = 'w-full px-3 py-2.5 rounded-xl border border-[#DED6C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40';

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const start = `${startDate}T${startTime}:00`;
    const end = `${endDate}T${endTime}:00`;
    if (new Date(start) >= new Date(end)) { setError(t.endAfterStart); return; }
    onSave({ id: generateId(), room_id: roomId, start_datetime: start, end_datetime: end, reason: reason.trim() });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="border-b border-[#DED6C4] px-5 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-[#10362D]">{t.blockRoomTitle}</h3>
          <button onClick={onClose} className="text-[#9B9B9B] text-xl hover:text-[#10362D]">✕</button>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5">{t.room}</label>
            <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className={iClass}>
              {rooms.map((r, idx) => <option key={r.id} value={r.id}>{ROOM_NAMES[idx]}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5">{t.startLabel}</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={iClass} />
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={`${iClass} mt-2`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5">{t.endLabel}</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={iClass} />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={`${iClass} mt-2`} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5">{t.reason}</label>
            <input type="text" placeholder={t.reasonPlaceholder} value={reason} onChange={(e) => setReason(e.target.value)} className={iClass} />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} className="py-3 rounded-xl border border-[#DED6C4] text-sm text-[#6B6B6B]">{t.cancelBtn}</button>
            <button type="submit" className="py-3 rounded-xl bg-[#10362D] text-white text-sm font-semibold">{t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminPanel() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [rooms] = useRooms();
  const [bookings, setBookings] = useBookings();
  const [blocks, setBlocks] = useBlocks();
  const [settings] = useSettings();
  const [filterDate, setFilterDate] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterStatus, setFilterStatus] = useState<BookingStatus | ''>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [tab, setTab] = useState<'bookings' | 'blocks'>('bookings');

  const ROOM_NAMES = [t.room1Name, t.room2Name, t.room3Name];

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    const active = bookings.filter((b) => b.status !== 'cancelled');
    return {
      todayRevenue: active.filter((b) => b.start_datetime.startsWith(today)).reduce((s, b) => s + b.total_price, 0),
      monthRevenue: active.filter((b) => b.start_datetime.startsWith(thisMonth)).reduce((s, b) => s + b.total_price, 0),
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (filterDate && !b.start_datetime.startsWith(filterDate)) return false;
      if (filterRoom && b.room_id !== filterRoom) return false;
      if (filterStatus && b.status !== filterStatus) return false;
      return true;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [bookings, filterDate, filterRoom, filterStatus]);

  function updateStatus(id: string, status: BookingStatus) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  function deleteBooking(id: string) {
    if (confirm(t.deleteConfirm)) setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  function deleteBlock(id: string) { setBlocks((prev) => prev.filter((b) => b.id !== id)); }

  function getRoomName(id: string) {
    const idx = parseInt(id) - 1;
    return ROOM_NAMES[idx] ?? id;
  }

  const STATUS_LABELS: Record<BookingStatus, string> = {
    pending: t.pending, confirmed: t.confirm, cancelled: t.cancel, completed: t.complete,
  };

  const iClass = 'w-full px-3 py-2 rounded-xl border border-[#DED6C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#B08A3B]/40';

  return (
    <main className="min-h-screen bg-[#F6F2E8] pb-10">
      <div className="bg-[#10362D] text-white px-4 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.svg" alt="" className="w-10 h-10" />
            <div>
              <p className="text-[#B08A3B] text-xs font-semibold tracking-widest uppercase opacity-80">The Quiet Place</p>
              <h1 className="text-lg font-bold mt-0.5">{t.adminTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors">
              {t.adminSite}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5">
          <StatCard label={t.revenueToday} value={`${stats.todayRevenue.toLocaleString()} ₪`} />
          <StatCard label={t.revenueMonth} value={`${stats.monthRevenue.toLocaleString()} ₪`} />
          <StatCard label={t.totalBookings} value={String(stats.total)} />
          <StatCard label={t.pending} value={String(stats.pending)} sub={stats.pending > 0 ? t.requireConfirm : t.allConfirmed} />
        </div>

        <div className="flex gap-3 mb-5">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-[#B08A3B] hover:bg-[#8a6a28] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">{t.addBooking}</button>
          <button onClick={() => setShowBlockModal(true)} className="flex items-center gap-2 bg-[#10362D] hover:bg-[#1a5044] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">{t.blockRoom}</button>
        </div>

        <div className="flex gap-1 p-1 bg-[#F6F2E8] rounded-xl mb-5 w-fit">
          {(['bookings', 'blocks'] as const).map((tp) => (
            <button key={tp} onClick={() => setTab(tp)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === tp ? 'bg-white text-[#10362D] shadow-sm' : 'text-[#9B9B9B] hover:text-[#6B6B6B]'}`}>
              {tp === 'bookings' ? `${t.bookingsTab} (${bookings.length})` : `${t.blocksTab} (${blocks.length})`}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <>
            <div className="bg-white rounded-2xl border border-[#DED6C4] p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-[#9B9B9B] mb-1">{t.filterDate}</label>
                  <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className={iClass} />
                </div>
                <div>
                  <label className="block text-xs text-[#9B9B9B] mb-1">{t.filterRoom}</label>
                  <select value={filterRoom} onChange={(e) => setFilterRoom(e.target.value)} className={iClass}>
                    <option value="">{t.allRooms}</option>
                    {rooms.map((r, idx) => <option key={r.id} value={r.id}>{ROOM_NAMES[idx]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#9B9B9B] mb-1">{t.filterStatus}</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as BookingStatus | '')} className={iClass}>
                    <option value="">{t.allStatuses}</option>
                    {(Object.keys(STATUS_LABELS) as BookingStatus[]).map((k) => <option key={k} value={k}>{STATUS_LABELS[k]}</option>)}
                  </select>
                </div>
              </div>
              {(filterDate || filterRoom || filterStatus) && (
                <button onClick={() => { setFilterDate(''); setFilterRoom(''); setFilterStatus(''); }} className="mt-3 text-xs text-[#B08A3B] hover:text-[#8a6a28]">{t.resetFilters}</button>
              )}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-[#9B9B9B]">{t.noBookings}</div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-[#DED6C4] p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[#10362D] text-sm">{b.booking_number}</span>
                          <StatusPill status={b.status} t={t} />
                        </div>
                        <p className="text-sm font-medium text-[#10362D]">{getRoomName(b.room_id)}</p>
                      </div>
                      <span className="text-[#B08A3B] font-bold text-base">{b.total_price.toLocaleString()} ₪</span>
                    </div>
                    <div className="text-xs text-[#6B6B6B] space-y-1 mb-3">
                      <p>📅 {formatDateTime(b.start_datetime)} → {formatDateTime(b.end_datetime)}</p>
                      <p>👤 {b.customer_name} · {b.customer_phone}</p>
                      {b.notes && <p>💬 {b.notes}</p>}
                      <p className="text-[#C0B8A8]">{b.booking_type === 'nightly' ? t.nightly : t.hourly} · {t.created} {formatDate(b.created_at)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {b.status === 'pending' && (
                        <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200">{t.confirm}</button>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => updateStatus(b.id, 'completed')} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200">{t.complete}</button>
                      )}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100">{t.cancel}</button>
                      )}
                      {b.status === 'cancelled' && (
                        <button onClick={() => updateStatus(b.id, 'pending')} className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium hover:bg-amber-100">{t.restore}</button>
                      )}
                      <button onClick={() => deleteBooking(b.id)} className="px-3 py-1.5 border border-[#DED6C4] text-[#9B9B9B] rounded-lg text-xs font-medium hover:border-red-200 hover:text-red-400 ml-auto">{t.delete}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'blocks' && (
          <div className="space-y-3">
            {blocks.length === 0 ? (
              <div className="text-center py-12 text-[#9B9B9B]">{t.noBlocks}</div>
            ) : (
              blocks.map((bl) => (
                <div key={bl.id} className="bg-white rounded-2xl border border-[#DED6C4] p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-[#10362D] mb-1">{getRoomName(bl.room_id)}{bl.reason && <span className="text-[#9B9B9B] font-normal ml-2">— {bl.reason}</span>}</p>
                    <p className="text-xs text-[#6B6B6B]">{formatDateTime(bl.start_datetime)} → {formatDateTime(bl.end_datetime)}</p>
                  </div>
                  <button onClick={() => deleteBlock(bl.id)} className="text-[#9B9B9B] hover:text-red-400 transition-colors text-sm ml-4">🗑</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddBookingModal rooms={rooms} bookings={bookings} blocks={blocks} settings={settings}
          onSave={(b) => { setBookings((prev) => [...prev, b]); setShowAddModal(false); }}
          onClose={() => setShowAddModal(false)} />
      )}
      {showBlockModal && (
        <BlockRoomModal rooms={rooms}
          onSave={(bl) => { setBlocks((prev) => [...prev, bl]); setShowBlockModal(false); }}
          onClose={() => setShowBlockModal(false)} />
      )}
    </main>
  );
}

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('admin_authed') === '1') setIsAuthed(true);
      setChecked(true);
    }
  }, []);

  if (!checked) return null;

  if (!isAuthed) {
    return <LoginScreen onLogin={() => { sessionStorage.setItem('admin_authed', '1'); setIsAuthed(true); }} />;
  }

  return <AdminPanel />;
}
