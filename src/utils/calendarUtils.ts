import { DailyMenu, MenuItemOption } from '../types';

// Peruvian statutory holidays (Format MM-DD or YYYY-MM-DD)
export const PERUVIAN_HOLIDAYS_2026: Record<string, string> = {
  '2026-01-01': 'Año Nuevo',
  '2026-04-02': 'Jueves Santo',
  '2026-04-03': 'Viernes Santo',
  '2026-05-01': 'Día del Trabajo',
  '2026-06-07': 'Batalla de Arica / Día de la Bandera',
  '2026-06-29': 'San Pedro y San Pablo',
  '2026-07-23': 'Día de la Fuerza Aérea del Perú',
  '2026-07-28': 'Fiestas Patrias (Independencia)',
  '2026-07-29': 'Fiestas Patrias (Fuerzas Armadas)',
  '2026-08-06': 'Batalla de Junín',
  '2026-08-30': 'Santa Rosa de Lima',
  '2026-10-08': 'Combate de Angamos',
  '2026-11-01': 'Día de Todos los Santos',
  '2026-12-08': 'Inmaculada Concepción',
  '2026-12-09': 'Batalla de Ayacucho',
  '2026-12-25': 'Navidad',
};

export const DAY_NAMES = [
  'DOMINGO',
  'LUNES',
  'MARTES',
  'MIÉRCOLES',
  'JUEVES',
  'VIERNES',
  'SÁBADO',
];

export const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

// Rotating dishes catalog for Planta Nova corporate dining
interface DishRecipe {
  title: string;
  category: 'Criollo' | 'Saludable' | 'Norteño' | 'Internacional' | 'Especial';
  mainDish: string;
  description: string;
  drink: string;
}

const CRIOLLO_OPTIONS: DishRecipe[] = [
  {
    title: 'Opción 1 - Lomo Saltado Criollo',
    category: 'Criollo',
    mainDish: 'Lomo Saltado',
    description: 'Tiras de lomo salteadas al wok con cebolla, tomate, ají amarillo, papas fritas crocantes y arroz graneado',
    drink: 'Refresco de emoliente',
  },
  {
    title: 'Opción 1 - Ají de Gallina Clásico',
    category: 'Criollo',
    mainDish: 'Ají de Gallina',
    description: 'Pechuga deshilachada en crema suave de ají amarillo, papa amarilla, huevo duro, aceituna de botija y arroz blanco',
    drink: 'Refresco de maracuyá',
  },
  {
    title: 'Opción 1 - Arroz con Pollo y Papa a la Huancaína',
    category: 'Criollo',
    mainDish: 'Arroz con Pollo',
    description: 'Arroz al culantro con cerveza negra, presa de pollo tierna y porción de papa con salsa huancaína tradicional',
    drink: 'Chicha morada natural',
  },
  {
    title: 'Opción 1 - Tallarines Rojos con Pollo y Queso',
    category: 'Criollo',
    mainDish: 'Tallarines Rojos',
    description: 'Pasta en salsa pomodoro casera con trozos de pollo estofado al laurel y queso parmesano rallado',
    drink: 'Jugo de cebada',
  },
  {
    title: 'Opción 1 - Cau Cau Criollo a la Limeña',
    category: 'Criollo',
    mainDish: 'Cau Cau',
    description: 'Guiso tradicional de mondonguito o pollo con papa en cubos, hierbabuena fresca, arvejas y arroz graneado',
    drink: 'Emoliente con limón',
  },
  {
    title: 'Opción 1 - Carapulcra con Sopa Seca Chinchana',
    category: 'Criollo',
    mainDish: 'Carapulcra con Sopa Seca',
    description: 'Papa seca cocinada a fuego lento con chancho y maní tostado, servida con tallarines a la albahaca',
    drink: 'Chicha morada helada',
  },
  {
    title: 'Opción 1 - Locro de Zapallo Macre con Queso y Huevo',
    category: 'Criollo',
    mainDish: 'Locro de Zapallo',
    description: 'Cremoso guiso de zapallo con choclo tierno, arvejitas, dados de queso fresco andino y huevo frito montado',
    drink: 'Refresco de maracuyá',
  },
  {
    title: 'Opción 1 - Seco de Res a la Norteña con Frejoles',
    category: 'Criollo',
    mainDish: 'Seco de Res',
    description: 'Trozos de res cocidos en salsa de culantro y chicha de jora acompañados de frejoles canario cremosos y arroz',
    drink: 'Limonada natural',
  },
];

const HEALTHY_OPTIONS: DishRecipe[] = [
  {
    title: 'Opción 2 - Pechuga a la Plancha con Puré de Espinaca',
    category: 'Saludable',
    mainDish: 'Pechuga a la Plancha',
    description: 'Filete magro de pechuga dorada a las finas hierbas con puré verde nutritivo y ensalada fresca con vinagreta de limón',
    drink: 'Infusión digestiva de hierbaluisa',
  },
  {
    title: 'Opción 2 - Filete de Tilapia al Horno con Yuca al Vapor',
    category: 'Saludable',
    mainDish: 'Filete de Tilapia al Horno',
    description: 'Pescado blanco marinado con orégano y ajo suave, acompañado de yuca sancochada y ensalada mixta de betarraga y zanahoria',
    drink: 'Agua de manzana cocida',
  },
  {
    title: 'Opción 2 - Ensalada Caprese con Pechuga Grillada',
    category: 'Saludable',
    mainDish: 'Ensalada Caprese con Pollo',
    description: 'Mix de lechugas orgánicas, pechuga a la parrilla en tiras, tomate cherry, albahaca fresca y dados de queso andino bajo en sal',
    drink: 'Infusión fría de menta y jengibre',
  },
  {
    title: 'Opción 2 - Pescado Sudado al Culantro con Arroz Integral',
    category: 'Saludable',
    mainDish: 'Pescado Sudado',
    description: 'Filete al vapor en caldo aromatizado con tomate, cebolla en gajos, ají sin picante y arroz suave',
    drink: 'Limonada con chía',
  },
  {
    title: 'Opción 2 - Pechuga al Grill con Verduras Salteadas al Wok',
    category: 'Saludable',
    mainDish: 'Pechuga al Grill',
    description: 'Tiras de pollo salteadas sin grasa con brócoli, pimiento tricolor, zapallito italiano y semillas de ajonjolí',
    drink: 'Jugo natural de piña',
  },
  {
    title: 'Opción 2 - Pastel de Acelga Nutritivo con Quinua',
    category: 'Saludable',
    mainDish: 'Pastel de Acelga',
    description: 'Porción horneada de pastel de acelga y verduras con porción de quinua perlada graneada y ensalada de palta',
    drink: 'Infusión de muña',
  },
];

const SPECIAL_OPTIONS: DishRecipe[] = [
  {
    title: 'Opción 3 - Pollo al Horno al Romero con Puré y Ensalada Rusa',
    category: 'Especial',
    mainDish: 'Pollo al Horno',
    description: 'Presa de pollo dorada crocante al romero acompañada de suave puré de papa amarilla y ensalada rusa tradicional',
    drink: 'Chicha morada casera',
  },
  {
    title: 'Opción 3 - Arroz Chaufa Especial con Wantán Frito',
    category: 'Norteño',
    mainDish: 'Arroz Chaufa Especial',
    description: 'Arroz salteado al wok con trozos de pollo, tortilla de huevo, cebollita china, sillao premium y dos wantanes dorados',
    drink: 'Té verde frío con durazno',
  },
  {
    title: 'Opción 3 - Pollo Chijaukay con Arroz Chaufa Blanco',
    category: 'Especial',
    mainDish: 'Pollo Chijaukay',
    description: 'Trozos de pechuga arrebozados bañados en salsa oscura con semillas de sésamo y porción de chaufa blanco',
    drink: 'Refresco de maracuyá',
  },
  {
    title: 'Opción 3 - Milanesa de Pollo Casera con Papas Doradas',
    category: 'Especial',
    mainDish: 'Milanesa de Pollo',
    description: 'Filete apanado crocante servido con papas doradas rústicas, arroz blanco y ensalada fresca con salsa tártara',
    drink: 'Chicha morada artesanal',
  },
  {
    title: 'Opción 3 - Estofado de Res con Champiñones y Arroz',
    category: 'Norteño',
    mainDish: 'Estofado de Res',
    description: 'Guiso tierno de res estofado con champiñones frescos, arvejas, zanahoria y porción generosa de arroz blanco',
    drink: 'Emoliente tibio',
  },
  {
    title: 'Opción 3 - Tallarines Saltados con Pollo al Wok',
    category: 'Especial',
    mainDish: 'Tallarines Saltados',
    description: 'Tallarines salteados con fuego vivo, cebolla roja, tomate, ají amarillo y trozos de pechuga jugosa',
    drink: 'Refresco de carambola',
  },
];

/**
 * Checks whether a given date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Returns the holiday name if the date is an official Peruvian holiday, otherwise null
 */
export function getHolidayName(dateStr: string): string | null {
  return PERUVIAN_HOLIDAYS_2026[dateStr] || null;
}

/**
 * Checks if a given YYYY-MM-DD date is a workday (Monday through Friday, not a holiday)
 */
export function isWorkDayDate(dateStr: string): boolean {
  if (PERUVIAN_HOLIDAYS_2026[dateStr]) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const day = dateObj.getDay();
  return day >= 1 && day <= 5; // Monday=1 to Friday=5
}

/**
 * Generates the complete daily menu for a specific date (if working day)
 */
export function generateMenuForDate(dateStr: string): DailyMenu {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeekIndex = dateObj.getDay();
  const dayOfWeek = DAY_NAMES[dayOfWeekIndex];
  const holidayName = getHolidayName(dateStr);
  const isWeekendDay = isWeekend(dateObj);
  const isWorkDay = !isWeekendDay && !holidayName;

  const displayDay = d.toString().padStart(2, '0');
  const displayMonth = m.toString().padStart(2, '0');
  const displayDate = `${displayDay} / ${displayMonth} / ${y}`;

  // Deterministic seed based on day number to select dishes
  const seed = (y * 31 + m * 7 + d);
  const opt1Recipe = CRIOLLO_OPTIONS[seed % CRIOLLO_OPTIONS.length];
  const opt2Recipe = HEALTHY_OPTIONS[(seed + 1) % HEALTHY_OPTIONS.length];
  const opt3Recipe = SPECIAL_OPTIONS[(seed + 2) % SPECIAL_OPTIONS.length];

  const options: MenuItemOption[] = [
    {
      id: `opt-1-${dateStr}`,
      optionNumber: 1,
      title: opt1Recipe.title,
      category: opt1Recipe.category,
      mainDish: opt1Recipe.mainDish,
      description: opt1Recipe.description,
      drink: opt1Recipe.drink,
      fullText: `${opt1Recipe.description} + ${opt1Recipe.drink}`,
    },
    {
      id: `opt-2-${dateStr}`,
      optionNumber: 2,
      title: opt2Recipe.title,
      category: opt2Recipe.category,
      mainDish: opt2Recipe.mainDish,
      description: opt2Recipe.description,
      drink: opt2Recipe.drink,
      fullText: `${opt2Recipe.description} + ${opt2Recipe.drink}`,
    },
    {
      id: `opt-3-${dateStr}`,
      optionNumber: 3,
      title: opt3Recipe.title,
      category: opt3Recipe.category,
      mainDish: opt3Recipe.mainDish,
      description: opt3Recipe.description,
      drink: opt3Recipe.drink,
      fullText: `${opt3Recipe.description} + ${opt3Recipe.drink}`,
    },
  ];

  let dayLabel = 'Día Hábil (L - V)';
  if (holidayName) {
    dayLabel = `Feriado: ${holidayName}`;
  } else if (isWeekendDay) {
    dayLabel = 'Fin de Semana (No Laborable)';
  }

  return {
    id: dateStr,
    date: dateStr,
    dayOfWeek,
    displayDate,
    isWorkDay,
    isHoliday: !!holidayName,
    dayLabel,
    options: isWorkDay ? options : [],
  };
}

/**
 * Generates menus for ALL working days of a given month
 */
export function generateMonthMenus(year: number, month: number): DailyMenu[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const menus: DailyMenu[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = month.toString().padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    
    // Only include working days (Monday-Friday, not holidays)
    if (isWorkDayDate(dateStr)) {
      menus.push(generateMenuForDate(dateStr));
    }
  }

  return menus;
}

/**
 * Generates menus for a custom date range (e.g. from 2026-08-31 to 2026-09-30),
 * excluding weekends and statutory holidays.
 */
export function generateDateRangeMenus(startDateStr: string = '2026-08-31', endDateStr: string = '2026-09-30'): DailyMenu[] {
  const menus: DailyMenu[] = [];
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');

  const curr = new Date(start);
  while (curr <= end) {
    const y = curr.getFullYear();
    const m = (curr.getMonth() + 1).toString().padStart(2, '0');
    const d = curr.getDate().toString().padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    if (isWorkDayDate(dateStr)) {
      menus.push(generateMenuForDate(dateStr));
    }

    curr.setDate(curr.getDate() + 1);
  }

  return menus;
}

/**
 * Gets the next working day (skipping weekends and clamping to range)
 */
export function getNextWorkDay(dateStr: string, minDate: string = '2026-08-31', maxDate: string = '2026-09-30'): string {
  const date = new Date(dateStr + 'T00:00:00');
  do {
    date.setDate(date.getDate() + 1);
  } while (date.getDay() === 0 || date.getDay() === 6);

  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const res = `${y}-${m}-${d}`;
  if (res > maxDate) return maxDate;
  return res;
}

/**
 * Gets the previous working day (skipping weekends and clamping to range)
 */
export function getPrevWorkDay(dateStr: string, minDate: string = '2026-08-31', maxDate: string = '2026-09-30'): string {
  const date = new Date(dateStr + 'T00:00:00');
  do {
    date.setDate(date.getDate() - 1);
  } while (date.getDay() === 0 || date.getDay() === 6);

  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const res = `${y}-${m}-${d}`;
  if (res < minDate) return minDate;
  return res;
}

export interface CalendarDayInfo {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number; // 1 - 31
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  dayName: string; // 'LUNES', etc.
  isCurrentMonth: boolean;
  isWorkDay: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  hasMenu: boolean;
}

/**
 * Builds the complete monthly grid for calendar UI (including empty offset cells)
 */
export function getCalendarGridForMonth(year: number, month: number): CalendarDayInfo[] {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // In Peru/LatAm, week starts on Monday (1). 0 is Sunday, so Monday=0, Sunday=6 offset
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 is Sun, 1 is Mon...
  const leadingBlanks = (firstDayWeekday + 6) % 7; // Number of days from Monday

  const days: CalendarDayInfo[] = [];

  // Previous month trailing days
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();
  for (let i = leadingBlanks - 1; i >= 0; i--) {
    const prevDay = prevMonthLastDate - i;
    const prevMonthNumber = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const dateStr = `${prevYear}-${prevMonthNumber.toString().padStart(2, '0')}-${prevDay.toString().padStart(2, '0')}`;
    const dateObj = new Date(prevYear, prevMonthNumber - 1, prevDay);
    
    days.push({
      dateStr,
      dayNumber: prevDay,
      dayOfWeek: dateObj.getDay(),
      dayName: DAY_NAMES[dateObj.getDay()],
      isCurrentMonth: false,
      isWorkDay: false,
      isWeekend: isWeekend(dateObj),
      isHoliday: !!getHolidayName(dateStr),
      holidayName: getHolidayName(dateStr) || undefined,
      hasMenu: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = d.toString().padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    const dateObj = new Date(year, month - 1, d);
    const dayOfWeek = dateObj.getDay();
    const weekend = isWeekend(dateObj);
    const holiday = getHolidayName(dateStr);
    const isWork = !weekend && !holiday;

    days.push({
      dateStr,
      dayNumber: d,
      dayOfWeek,
      dayName: DAY_NAMES[dayOfWeek],
      isCurrentMonth: true,
      isWorkDay: isWork,
      isWeekend: weekend,
      isHoliday: !!holiday,
      holidayName: holiday || undefined,
      hasMenu: isWork,
    });
  }

  // Trailing blanks to complete the final week (multiple of 7)
  const remainder = days.length % 7;
  if (remainder !== 0) {
    const trailingCount = 7 - remainder;
    const nextMonthNumber = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    for (let t = 1; t <= trailingCount; t++) {
      const dateStr = `${nextYear}-${nextMonthNumber.toString().padStart(2, '0')}-${t.toString().padStart(2, '0')}`;
      const dateObj = new Date(nextYear, nextMonthNumber - 1, t);
      days.push({
        dateStr,
        dayNumber: t,
        dayOfWeek: dateObj.getDay(),
        dayName: DAY_NAMES[dateObj.getDay()],
        isCurrentMonth: false,
        isWorkDay: false,
        isWeekend: isWeekend(dateObj),
        isHoliday: !!getHolidayName(dateStr),
        holidayName: getHolidayName(dateStr) || undefined,
        hasMenu: false,
      });
    }
  }

  return days;
}
