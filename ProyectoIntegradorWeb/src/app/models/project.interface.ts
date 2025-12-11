export interface Project {
  id?: string; // ID del proyecto, opcional para cuando se crea
  uid: string; // ID del programador al que pertenece el proyecto
  name: string; // Nombre del proyecto (antes title)
 title: string;  
  description: string;
  imageUrl: string; // URL de la imagen del proyecto
  roleInProject: string; // Rol (Frontend, Backend, BD)
  technologies: string[]; // Tecnologías utilizadas
  repositoryLink: string; // Enlace al repositorio
  deployLink: string; // Enlace al deploy/demo
  type: 'Academico' | 'Laboral'; // Tipo de proyecto: Académico o Laboral
  status: 'En desarrollo' | 'Completado' | 'Pausado';
  createdAt: Date; // Fecha de creación
}
