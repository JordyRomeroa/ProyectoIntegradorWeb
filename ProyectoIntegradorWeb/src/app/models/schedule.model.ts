export interface Schedule {
  id?: string;
  programmerId: string;
  dayOfWeek: string; // Ej: 'Lunes', 'Martes'
  startTime: string; // Ej: '09:00'
  endTime: string; // Ej: '17:00'
  isActive: boolean; // Para habilitar/deshabilitar un horario
}
