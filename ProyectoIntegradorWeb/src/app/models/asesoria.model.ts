export interface Asesoria {
  id?: string;
  idProgramador: string;
  idUsuario: string;
  nombreUsuario: string;
  emailUsuario: string;
  mensaje: string;
  estado: 'Pendiente' | 'Aceptada' | 'Rechazada' | 'Completada';
  fechaSolicitud: Date;
}
