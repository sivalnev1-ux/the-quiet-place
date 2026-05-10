export type Lang = 'he' | 'ru' | 'en';

export const SUPPORTED_LANGS: Lang[] = ['he', 'ru', 'en'];

/** Detect browser/system language and map to supported lang */
export function detectLang(): Lang {
  if (typeof window === 'undefined') return 'he';
  const saved = localStorage.getItem('hotel_lang') as Lang | null;
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  const browserLang = navigator.language?.slice(0, 2).toLowerCase();
  if (browserLang === 'ru') return 'ru';
  if (browserLang === 'he' || browserLang === 'iw') return 'he';
  if (browserLang === 'en') return 'en';
  return 'he'; // default
}

export function saveLang(lang: Lang) {
  localStorage.setItem('hotel_lang', lang);
}

export const RTL_LANGS: Lang[] = ['he'];

export function isRTL(lang: Lang) {
  return RTL_LANGS.includes(lang);
}

// ── Translations ──────────────────────────────────────────────────────────

export interface Translations {
  hotelName: string;
  hotelTagline1: string;
  hotelTagline2: string;
  hotelDescription: string;
  bookNow: string;
  viewAllRooms: string;
  ourRooms: string;
  rooms: string; // "3 номера"
  pricePerNight: string;
  pricePerHour: string;
  selectRoom: string;
  management: string;

  // Rooms page
  chooseRoom: string;
  perNight: string;
  perHour: string;
  checkIn: string;
  checkOut: string;
  minOneHour: string;
  freeToday: string;
  busyNow: string;
  hasBookings: string;
  free: string;
  busy: string;
  partial: string;
  selectAndBook: string;
  busyNowBtn: string;

  // Booking page
  booking: string;
  room: string;
  bookingType: string;
  perNightType: string;
  perHourType: string;
  dateAndTime: string;
  arrival: string;
  departure: string;
  from14: string;
  until12: string;
  date: string;
  start: string;
  end: string;
  totalToPay: string;
  available: string;
  unavailable: string;
  yourData: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  comment: string;
  commentPlaceholder: string;
  confirmBooking: string;
  processing: string;
  bookingNote: string;
  pendingStatus: string;
  errorChooseRoom: string;
  errorEnterName: string;
  errorEnterPhone: string;
  errorEndAfterStart: string;
  errorSlotTaken: string;
  errorRaceCondition: string;

  // Confirmation page
  bookingAccepted: string;
  requestAccepted: string;
  confirmWhatsApp: string;
  bookingNumberLabel: string;
  roomLabel: string;
  typeLabel: string;
  arrivalLabel: string;
  departureLabel: string;
  nameLabel: string;
  phoneLabel: string;
  commentLabel: string;
  totalLabel: string;
  pendingBadge: string;
  confirmWhatsAppBtn: string;
  backHome: string;
  bookingNotFound: string;
  whatsAppGreeting: string;
  whatsAppBooking: string;
  whatsAppRoom: string;
  whatsAppDate: string;
  whatsAppTime: string;
  whatsAppTotal: string;

  // Room names & descriptions
  room1Name: string;
  room1Desc: string;
  room2Name: string;
  room2Desc: string;
  room3Name: string;
  room3Desc: string;

  // Admin
  adminTitle: string;
  adminSite: string;
  adminPassword: string;
  adminLogin: string;
  adminWrongPass: string;
  revenueToday: string;
  revenueMonth: string;
  totalBookings: string;
  pending: string;
  requireConfirm: string;
  allConfirmed: string;
  addBooking: string;
  blockRoom: string;
  bookingsTab: string;
  blocksTab: string;
  filterDate: string;
  filterRoom: string;
  filterStatus: string;
  allRooms: string;
  allStatuses: string;
  resetFilters: string;
  noBookings: string;
  noBlocks: string;
  confirm: string;
  complete: string;
  cancel: string;
  restore: string;
  delete: string;
  deleteConfirm: string;
  nightly: string;
  hourly: string;
  created: string;
  blockRoomTitle: string;
  reason: string;
  reasonPlaceholder: string;
  startLabel: string;
  endLabel: string;
  save: string;
  cancelBtn: string;
  fillNamePhone: string;
  endAfterStart: string;
  slotTaken: string;
  statusLabel: string;
  noteLabel: string;
  back: string;
}

export const translations: Record<Lang, Translations> = {
  he: {
    hotelName: 'The Quiet Place',
    hotelTagline1: 'מקום שקט',
    hotelTagline2: 'רחוק מהרעש',
    hotelDescription: 'שלושה חדרים ייחודיים למנוחה, עבודה ורומנטיקה. הזמינו ללילה או לשעות — פשוט ומהיר.',
    bookNow: 'הזמן חדר',
    viewAllRooms: 'צפה בכל החדרים',
    ourRooms: 'החדרים שלנו',
    rooms: 'חדרים',
    pricePerNight: '₪ / לילה',
    pricePerHour: '₪ / שעה',
    selectRoom: 'בחר →',
    management: 'ניהול',

    chooseRoom: 'בחר חדר',
    perNight: 'ללילה',
    perHour: 'לשעה',
    checkIn: "כניסה 14:00",
    checkOut: 'יציאה 12:00',
    minOneHour: 'מינימום שעה אחת',
    freeToday: 'פנוי היום',
    busyNow: 'תפוס כרגע',
    hasBookings: 'יש הזמנות להיום',
    free: 'פנוי',
    busy: 'תפוס',
    partial: 'חלקי',
    selectAndBook: 'בחר והזמן',
    busyNowBtn: 'תפוס כרגע',

    booking: 'הזמנה',
    room: 'חדר',
    bookingType: 'סוג הזמנה',
    perNightType: '🌙 ללילה',
    perHourType: '⏱ לשעות',
    dateAndTime: 'תאריך ושעה',
    arrival: 'כניסה',
    departure: 'יציאה',
    from14: 'מ-14:00',
    until12: 'עד 12:00',
    date: 'תאריך',
    start: 'התחלה',
    end: 'סיום',
    totalToPay: 'סה״כ לתשלום',
    available: '✓ פנוי',
    unavailable: '✗ תפוס',
    yourData: 'הפרטים שלך',
    namePlaceholder: 'ישראל ישראלי',
    phonePlaceholder: '+972 50 000 0000',
    comment: 'הערה',
    commentPlaceholder: 'בקשות, שאלות...',
    confirmBooking: 'אשר הזמנה',
    processing: 'מעבד...',
    bookingNote: 'לאחר השליחה הסטטוס: ממתין לאישור. ניצור איתך קשר.',
    pendingStatus: 'ממתין לאישור',
    errorChooseRoom: 'יש לבחור חדר',
    errorEnterName: 'יש להזין שם',
    errorEnterPhone: 'יש להזין מספר טלפון',
    errorEndAfterStart: 'שעת סיום חייבת להיות אחרי שעת ההתחלה',
    errorSlotTaken: 'השעה הנבחרת תפוסה. אנא בחר שעה אחרת.',
    errorRaceCondition: 'לצערנו, הזמן זה הוזמן. אנא בחר שעה אחרת.',

    bookingAccepted: 'הבקשה התקבלה!',
    requestAccepted: 'ההזמנה שלך ממתינה לאישור. לחץ למטה כדי להודיע לנו בוואטסאפ.',
    confirmWhatsApp: 'אשר בוואטסאפ',
    bookingNumberLabel: 'מספר הזמנה',
    roomLabel: 'חדר',
    typeLabel: 'סוג',
    arrivalLabel: 'כניסה',
    departureLabel: 'יציאה',
    nameLabel: 'שם',
    phoneLabel: 'טלפון',
    commentLabel: 'הערה',
    totalLabel: 'סה״כ',
    pendingBadge: '⏳ ממתין לאישור',
    confirmWhatsAppBtn: 'אשר בוואטסאפ',
    backHome: 'לעמוד הראשי',
    bookingNotFound: 'ההזמנה לא נמצאה',
    whatsAppGreeting: 'שלום! רוצה לאשר הזמנה.',
    whatsAppBooking: '📋 הזמנה',
    whatsAppRoom: '🏨 חדר',
    whatsAppDate: '📅 תאריך',
    whatsAppTime: '⏰ שעה',
    whatsAppTotal: '💰 סכום',

    room1Name: 'חדר 1',
    room1Desc: 'חדר נעים עם מיטה זוגית, פינה שקטה במרכז. אידיאלי למנוחה ובידוד.',
    room2Name: 'חדר 2',
    room2Desc: 'סוויטה מרווחת עם אזור עבודה וספה. בחירה מצוינת לנסיעות עסקיות.',
    room3Name: 'חדר 3',
    room3Desc: 'חדר רומנטי עם נוף פנורמי ואמבטיה גדולה. נוצר לרגעים מיוחדים.',

    adminTitle: 'לוח בקרה',
    adminSite: 'לאתר →',
    adminPassword: 'סיסמה',
    adminLogin: 'כניסה',
    adminWrongPass: 'סיסמה שגויה',
    revenueToday: 'הכנסה היום',
    revenueMonth: 'הכנסה החודש',
    totalBookings: 'סה״כ הזמנות',
    pending: 'ממתינות',
    requireConfirm: 'דורשות אישור',
    allConfirmed: 'הכל מאושר',
    addBooking: '+ הוסף הזמנה',
    blockRoom: '🔒 חסום חדר',
    bookingsTab: 'הזמנות',
    blocksTab: 'חסימות',
    filterDate: 'תאריך',
    filterRoom: 'חדר',
    filterStatus: 'סטטוס',
    allRooms: 'כל החדרים',
    allStatuses: 'כל הסטטוסים',
    resetFilters: 'אפס מסננים',
    noBookings: 'אין הזמנות לפי הסינון שנבחר',
    noBlocks: 'אין חסימות פעילות',
    confirm: '✓ אשר',
    complete: '✓ השלם',
    cancel: '✕ בטל',
    restore: '↩ שחזר',
    delete: '🗑 מחק',
    deleteConfirm: 'למחוק את ההזמנה?',
    nightly: 'ללילה',
    hourly: 'לשעות',
    created: 'נוצר',
    blockRoomTitle: 'חסום חדר',
    reason: 'סיבה',
    reasonPlaceholder: 'ניקיון, תיקון...',
    startLabel: 'התחלה',
    endLabel: 'סיום',
    save: 'שמור',
    cancelBtn: 'ביטול',
    fillNamePhone: 'יש למלא שם וטלפון',
    endAfterStart: 'שעת סיום חייבת להיות אחרי ההתחלה',
    slotTaken: 'השעה תפוסה על ידי הזמנה אחרת',
    statusLabel: 'סטטוס',
    noteLabel: 'הערה',
    back: '←',
  },

  ru: {
    hotelName: 'The Quiet Place',
    hotelTagline1: 'Тихое место',
    hotelTagline2: 'вдали от шума',
    hotelDescription: 'Три уникальных номера для отдыха, работы и романтики. Бронируйте на ночь или по часам — просто и быстро.',
    bookNow: 'Забронировать номер',
    viewAllRooms: 'Посмотреть все номера',
    ourRooms: 'Наши номера',
    rooms: 'номера',
    pricePerNight: '₪ / ночь',
    pricePerHour: '₪ / час',
    selectRoom: 'Выбрать →',
    management: 'Управление',

    chooseRoom: 'Выберите номер',
    perNight: 'За ночь',
    perHour: 'За час',
    checkIn: 'заезд 14:00',
    checkOut: 'выезд 12:00',
    minOneHour: 'минимум 1 час',
    freeToday: 'Свободен сегодня',
    busyNow: 'Занят сейчас',
    hasBookings: 'Есть брони на сегодня',
    free: 'Свободно',
    busy: 'Занято',
    partial: 'Частично',
    selectAndBook: 'Выбрать и забронировать',
    busyNowBtn: 'Занято сейчас',

    booking: 'Бронирование',
    room: 'Номер',
    bookingType: 'Тип бронирования',
    perNightType: '🌙 На ночь',
    perHourType: '⏱ По часам',
    dateAndTime: 'Дата и время',
    arrival: 'Заезд',
    departure: 'Выезд',
    from14: 'с 14:00',
    until12: 'до 12:00',
    date: 'Дата',
    start: 'Начало',
    end: 'Конец',
    totalToPay: 'Итого к оплате',
    available: '✓ Доступно',
    unavailable: '✗ Занято',
    yourData: 'Ваши данные',
    namePlaceholder: 'Иван Иванов',
    phonePlaceholder: '+972 50 000 0000',
    comment: 'Комментарий',
    commentPlaceholder: 'Пожелания, вопросы...',
    confirmBooking: 'Подтвердить бронь',
    processing: 'Оформляем...',
    bookingNote: 'После отправки статус: Ожидает подтверждения. Мы свяжемся с вами.',
    pendingStatus: 'Ожидает подтверждения',
    errorChooseRoom: 'Выберите номер',
    errorEnterName: 'Введите имя',
    errorEnterPhone: 'Введите телефон',
    errorEndAfterStart: 'Время окончания должно быть позже времени начала',
    errorSlotTaken: 'Выбранное время недоступно. Пожалуйста, выберите другое.',
    errorRaceCondition: 'К сожалению, это время только что заняли. Выберите другое.',

    bookingAccepted: 'Заявка принята!',
    requestAccepted: 'Ваша бронь ожидает подтверждения. Нажмите кнопку ниже, чтобы уведомить нас в WhatsApp.',
    confirmWhatsApp: 'Подтвердить в WhatsApp',
    bookingNumberLabel: 'Номер брони',
    roomLabel: 'Номер',
    typeLabel: 'Тип',
    arrivalLabel: 'Заезд',
    departureLabel: 'Выезд',
    nameLabel: 'Имя',
    phoneLabel: 'Телефон',
    commentLabel: 'Комментарий',
    totalLabel: 'Итого',
    pendingBadge: '⏳ Ожидает подтверждения',
    confirmWhatsAppBtn: 'Подтвердить в WhatsApp',
    backHome: 'На главную',
    bookingNotFound: 'Бронь не найдена',
    whatsAppGreeting: 'Здравствуйте! Хочу подтвердить бронь.',
    whatsAppBooking: '📋 Бронь',
    whatsAppRoom: '🏨 Номер',
    whatsAppDate: '📅 Дата',
    whatsAppTime: '⏰ Время',
    whatsAppTotal: '💰 Сумма',

    room1Name: 'Комната 1',
    room1Desc: 'Уютный номер с двуспальной кроватью, тихий угол в центре. Идеален для отдыха и уединения.',
    room2Name: 'Комната 2',
    room2Desc: 'Просторный люкс с рабочей зоной и диваном. Отличный выбор для деловых поездок.',
    room3Name: 'Комната 3',
    room3Desc: 'Романтический номер с панорамным видом и большой ванной. Создан для особых моментов.',

    adminTitle: 'Панель управления',
    adminSite: 'На сайт →',
    adminPassword: 'Пароль',
    adminLogin: 'Войти',
    adminWrongPass: 'Неверный пароль',
    revenueToday: 'Выручка сегодня',
    revenueMonth: 'Выручка за месяц',
    totalBookings: 'Всего броней',
    pending: 'Ожидают',
    requireConfirm: 'требуют подтверждения',
    allConfirmed: 'всё подтверждено',
    addBooking: '+ Добавить бронь',
    blockRoom: '🔒 Заблокировать',
    bookingsTab: 'Брони',
    blocksTab: 'Блокировки',
    filterDate: 'Дата',
    filterRoom: 'Номер',
    filterStatus: 'Статус',
    allRooms: 'Все номера',
    allStatuses: 'Все статусы',
    resetFilters: 'Сбросить фильтры',
    noBookings: 'Нет броней по заданным фильтрам',
    noBlocks: 'Нет активных блокировок',
    confirm: '✓ Подтвердить',
    complete: '✓ Завершить',
    cancel: '✕ Отменить',
    restore: '↩ Восстановить',
    delete: '🗑 Удалить',
    deleteConfirm: 'Удалить бронь?',
    nightly: 'На ночь',
    hourly: 'По часам',
    created: 'Создано',
    blockRoomTitle: 'Заблокировать номер',
    reason: 'Причина',
    reasonPlaceholder: 'Уборка, ремонт...',
    startLabel: 'Начало',
    endLabel: 'Конец',
    save: 'Сохранить',
    cancelBtn: 'Отмена',
    fillNamePhone: 'Заполните имя и телефон',
    endAfterStart: 'Время окончания должно быть позже начала',
    slotTaken: 'Время занято другой бронью',
    statusLabel: 'Статус',
    noteLabel: 'Примечание',
    back: '←',
  },

  en: {
    hotelName: 'The Quiet Place',
    hotelTagline1: 'A quiet place',
    hotelTagline2: 'away from the noise',
    hotelDescription: 'Three unique rooms for rest, work and romance. Book for the night or by the hour — simple and fast.',
    bookNow: 'Book a Room',
    viewAllRooms: 'View All Rooms',
    ourRooms: 'Our Rooms',
    rooms: 'rooms',
    pricePerNight: '₪ / night',
    pricePerHour: '₪ / hour',
    selectRoom: 'Select →',
    management: 'Management',

    chooseRoom: 'Choose a Room',
    perNight: 'Per night',
    perHour: 'Per hour',
    checkIn: 'check-in 14:00',
    checkOut: 'check-out 12:00',
    minOneHour: 'minimum 1 hour',
    freeToday: 'Available today',
    busyNow: 'Occupied now',
    hasBookings: 'Has bookings today',
    free: 'Available',
    busy: 'Occupied',
    partial: 'Partial',
    selectAndBook: 'Select and Book',
    busyNowBtn: 'Occupied now',

    booking: 'Booking',
    room: 'Room',
    bookingType: 'Booking Type',
    perNightType: '🌙 Overnight',
    perHourType: '⏱ By the hour',
    dateAndTime: 'Date & Time',
    arrival: 'Check-in',
    departure: 'Check-out',
    from14: 'from 14:00',
    until12: 'until 12:00',
    date: 'Date',
    start: 'Start',
    end: 'End',
    totalToPay: 'Total to pay',
    available: '✓ Available',
    unavailable: '✗ Occupied',
    yourData: 'Your Details',
    namePlaceholder: 'John Smith',
    phonePlaceholder: '+972 50 000 0000',
    comment: 'Comment',
    commentPlaceholder: 'Requests, questions...',
    confirmBooking: 'Confirm Booking',
    processing: 'Processing...',
    bookingNote: 'After submission status: Pending confirmation. We will contact you.',
    pendingStatus: 'Pending confirmation',
    errorChooseRoom: 'Please choose a room',
    errorEnterName: 'Please enter your name',
    errorEnterPhone: 'Please enter your phone number',
    errorEndAfterStart: 'End time must be after start time',
    errorSlotTaken: 'This time slot is unavailable. Please choose another.',
    errorRaceCondition: 'Sorry, this slot was just taken. Please choose another time.',

    bookingAccepted: 'Booking received!',
    requestAccepted: 'Your booking is pending confirmation. Tap below to notify us on WhatsApp.',
    confirmWhatsApp: 'Confirm on WhatsApp',
    bookingNumberLabel: 'Booking number',
    roomLabel: 'Room',
    typeLabel: 'Type',
    arrivalLabel: 'Check-in',
    departureLabel: 'Check-out',
    nameLabel: 'Name',
    phoneLabel: 'Phone',
    commentLabel: 'Comment',
    totalLabel: 'Total',
    pendingBadge: '⏳ Pending confirmation',
    confirmWhatsAppBtn: 'Confirm on WhatsApp',
    backHome: 'Back to home',
    bookingNotFound: 'Booking not found',
    whatsAppGreeting: 'Hello! I would like to confirm a booking.',
    whatsAppBooking: '📋 Booking',
    whatsAppRoom: '🏨 Room',
    whatsAppDate: '📅 Date',
    whatsAppTime: '⏰ Time',
    whatsAppTotal: '💰 Total',

    room1Name: 'Room 1',
    room1Desc: 'Cozy room with a double bed, a quiet corner in the center. Ideal for rest and solitude.',
    room2Name: 'Room 2',
    room2Desc: 'Spacious suite with a work area and sofa. An excellent choice for business trips.',
    room3Name: 'Room 3',
    room3Desc: 'Romantic room with panoramic views and a large bathtub. Created for special moments.',

    adminTitle: 'Control Panel',
    adminSite: 'To site →',
    adminPassword: 'Password',
    adminLogin: 'Login',
    adminWrongPass: 'Wrong password',
    revenueToday: 'Revenue today',
    revenueMonth: 'Revenue this month',
    totalBookings: 'Total bookings',
    pending: 'Pending',
    requireConfirm: 'require confirmation',
    allConfirmed: 'all confirmed',
    addBooking: '+ Add Booking',
    blockRoom: '🔒 Block Room',
    bookingsTab: 'Bookings',
    blocksTab: 'Blocks',
    filterDate: 'Date',
    filterRoom: 'Room',
    filterStatus: 'Status',
    allRooms: 'All rooms',
    allStatuses: 'All statuses',
    resetFilters: 'Reset filters',
    noBookings: 'No bookings match the selected filters',
    noBlocks: 'No active blocks',
    confirm: '✓ Confirm',
    complete: '✓ Complete',
    cancel: '✕ Cancel',
    restore: '↩ Restore',
    delete: '🗑 Delete',
    deleteConfirm: 'Delete this booking?',
    nightly: 'Overnight',
    hourly: 'By the hour',
    created: 'Created',
    blockRoomTitle: 'Block Room',
    reason: 'Reason',
    reasonPlaceholder: 'Cleaning, repair...',
    startLabel: 'Start',
    endLabel: 'End',
    save: 'Save',
    cancelBtn: 'Cancel',
    fillNamePhone: 'Please fill in name and phone',
    endAfterStart: 'End time must be after start time',
    slotTaken: 'This time is taken by another booking',
    statusLabel: 'Status',
    noteLabel: 'Note',
    back: '←',
  },
};
