export interface Project {
  id?: string;
  uid: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'En desarrollo' | 'Completado' | 'Pausado';
  createdAt: Date;
}
