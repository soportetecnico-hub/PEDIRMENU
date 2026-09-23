export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  dni: string;
  department: string;
  company: string;
  verified: boolean;
}

export interface MenuItemOption {
  id: string; // e.g. "opcion-1", "opcion-2", "opcion-3"
  optionNumber: number; // 1, 2, 3
  title: string; // e.g. "Opción 1 - Ají de Gallina Clásico"
  category: 'Criollo' | 'Saludable' | 'Norteño' | 'Internacional' | 'Especial';
  mainDish: string;
  description: string;
  drink: string;
  fullText: string;
}

export interface DailyMenu {
  id: string; // Date key, e.g. "2026-09-22"
  date: string; // "2026-09-22"
  dayOfWeek: string; // "MARTES"
  displayDate: string; // "22 / 09 / 2026"
  isWorkDay: boolean; // true
  isHoliday?: boolean; // false
  dayLabel: string; // "Día Hábil (L - V)"
  options: MenuItemOption[];
}

export interface OrderElection {
  date: string; // "2026-09-22"
  dayName: string; // "MARTES"
  displayDate: string; // "22 / 09 / 2026"
  optionId: string; // "opcion-1"
  optionTitle: string; // "Opción 1 - Ají de Gallina Clásico"
  description: string; // "Ají de Gallina con arroz blanco..."
  category?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
}

export interface Order {
  id: string; // "PED-659230"
  orderCode: string; // "PED-659230"
  userId: string;
  userEmail: string;
  userName: string;
  userDni: string;
  userDepartment: string;
  userCompany: string;
  elections: OrderElection[];
  observations: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string; // ISO date string
  timeFormatted: string; // e.g. "10:14 AM" or "02:37 AM"
}

export type AppView = 'auth' | 'home' | 'order' | 'ticket';
