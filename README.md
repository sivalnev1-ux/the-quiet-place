# 🏡 Mini Hotel — Система бронирования

Современное веб-приложение для мини-гостиницы на 3 номера.  
Работает на телефоне и компьютере через браузер.

## Стек

| Слой | Технология |
|------|------------|
| Фреймворк | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS |
| Хранилище | localStorage (mock) → Supabase |
| Типизация | TypeScript |
| Иконки | Lucide React |

---

## Быстрый старт

### 1. Установка зависимостей

```bash
cd mini-hotel
npm install
```

### 2. Переменные окружения (опционально)

```bash
cp .env.local.example .env.local
```

Для MVP ничего заполнять не нужно — приложение работает на localStorage.

### 3. Запуск

```bash
npm run dev
```

Открой `http://localhost:3000`

---

## Страницы

| URL | Описание |
|-----|----------|
| `/` | Главная — Hero + карточки номеров |
| `/rooms` | Каталог номеров со статусами |
| `/booking` | Форма бронирования |
| `/booking?room=1` | Форма с предвыбранным номером |
| `/confirmation?id=...` | Экран успешной брони + WhatsApp |
| `/admin` | Панель управления |

---

## Админ-панель `/admin`

**Пароль по умолчанию:** `admin1234`

Можно изменить в `.env.local`:
```
NEXT_PUBLIC_ADMIN_PASSWORD=ваш_пароль
```

### Возможности

- 📊 Статистика: выручка сегодня/месяц, кол-во броней, ожидающие
- 📋 Список всех броней с фильтрами (дата / номер / статус)
- ✓ Подтверждение / отмена / завершение брони
- ➕ Ручное добавление брони
- 🔒 Блокировка номера на время (для уборки, ремонта)

---

## Логика бронирования

### Проверка пересечений

```
existing.start - buffer < new.end  AND  existing.end + buffer > new.start
```

Буфер по умолчанию: **30 минут** (для уборки между бронями).

### Статусы брони

| Статус | Описание |
|--------|----------|
| `pending` | Ожидает подтверждения |
| `confirmed` | Подтверждено |
| `cancelled` | Отменено |
| `completed` | Завершено |

---

## Подключение Supabase

1. Создай проект на [supabase.com](https://supabase.com)
2. Выполни SQL из `lib/supabase.ts` в SQL Editor
3. Заполни `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. Раскомментируй клиент в `lib/supabase.ts`
5. Замени `useLocalStorage`-хуки в `lib/store.ts` на Supabase-запросы

---

## Структура проекта

```
mini-hotel/
├── app/
│   ├── layout.tsx          # Root layout (шрифт, мета)
│   ├── page.tsx            # Главная страница
│   ├── globals.css         # Tailwind + кастомный CSS
│   ├── rooms/page.tsx      # Каталог номеров
│   ├── booking/page.tsx    # Форма бронирования
│   ├── confirmation/page.tsx # Экран подтверждения
│   └── admin/page.tsx      # Панель управления
├── lib/
│   ├── types.ts            # TypeScript интерфейсы
│   ├── mockData.ts         # Mock данные (номера, брони)
│   ├── bookingLogic.ts     # Бизнес-логика (проверка, цена)
│   ├── store.ts            # localStorage хуки
│   └── supabase.ts         # Шаблон Supabase + SQL схема
├── .env.local.example      # Пример переменных окружения
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Дизайн

| Элемент | Значение |
|---------|---------|
| Основной цвет | `#2D2D2D` (графит) |
| Акцент | `#C9A84C` (золото) |
| Фон | `#FAFAF8` (мягкий белый) |
| Карточки | `#F5F0E8` (тёплый бежевый) |
| Шрифт | Inter (Google Fonts) |

---

## Данные сохраняются в localStorage

| Ключ | Содержимое |
|------|------------|
| `hotel_rooms` | Номера |
| `hotel_bookings` | Брони |
| `hotel_blocks` | Блокировки |
| `hotel_settings` | Настройки (буфер, WhatsApp, валюта) |
| `hotel_last_booking` | Последняя бронь (для страницы подтверждения) |

Для сброса данных к дефолтным — очисти localStorage в DevTools.

---

## Настройка WhatsApp

В `/admin` → настройки (или напрямую в localStorage ключ `hotel_settings`):

```json
{
  "whatsapp_number": "+79001234567",
  "cleaning_buffer_minutes": 30,
  "currency": "₽"
}
```

---

## Сборка для продакшена

```bash
npm run build
npm start
```

Или деплой на [Vercel](https://vercel.com) — просто привяжи репозиторий и укажи переменные окружения.
