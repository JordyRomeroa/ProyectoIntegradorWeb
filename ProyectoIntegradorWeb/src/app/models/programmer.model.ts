export interface Programmer {
  uid: string;
  email: string;
  name: string;
  lastname: string;
  specialty: string; // Nueva propiedad para la especialidad del programador
  description: string;
  photoURL: string;
  role: 'programador';
  skills: string[];
  contactEmail: string; // Puede ser el mismo que email, o un contacto específico
  socialLinks: { platform: string, url: string }[]; // Lista de enlaces a redes sociales
}
