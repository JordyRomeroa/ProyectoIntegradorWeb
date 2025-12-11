export interface Programmer {
  uid: string;
  email: string;
  name: string;
  lastname: string;
  specialty: string; // Nueva propiedad para la especialidad del programador
  description: string;
  photoURL: string;
  role: 'programador' | 'programmer'; // Acepta 'programador' o 'programmer'
  skills: string[];
  contactLinks: string; // Cambiado a string para la lista de enlaces de contacto separados por coma
  socialNetworks: string; // Cambiado a string para la lista de redes sociales separadas por coma
}
