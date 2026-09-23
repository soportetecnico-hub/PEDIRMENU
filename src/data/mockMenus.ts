import { DailyMenu, UserProfile } from '../types';
import { generateMonthMenus } from '../utils/calendarUtils';

export const DEFAULT_USER_PROFILE: UserProfile = {
  uid: 'usr-carlos-mendoza-nova',
  email: 'soporte_tecnico@nova.pe',
  name: 'Carlos Alberto Mendoza Quispe',
  dni: '45892147',
  department: 'Producción Metalmecánica',
  company: 'Planta Nova',
  verified: true,
};

// Full month of working days (Lunes a Viernes, excluding weekends and holidays)
export const INITIAL_MENUS: DailyMenu[] = generateMonthMenus(2026, 9);

