export interface Asesoria {
  id?: string;
  idProgramador: string;
  idUsuario: string;
  nombreUsuario: string;
  emailUsuario: string;
  mensaje: string;
  estado: 'Pendiente' | 'Aceptada' | 'Rechazada' | 'Completada';
  fechaSolicitud: Date;
  fechaAsesoria: Date; // New field for the selected date of the advisory
  horaAsesoria: string; // New field for the selected time of the advisory (e.g., 'HH:mm')
}
