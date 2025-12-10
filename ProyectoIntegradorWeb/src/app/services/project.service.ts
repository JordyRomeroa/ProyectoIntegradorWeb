import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Project } from '../models/project.interface';
import { AuthService } from './auth.service';
import { map, switchMap } from 'rxjs/operators';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private firestore: Firestore, private authService: AuthService) { }

  getProjectsByUser(): Observable<Project[]> {
    return this.authService.user$.pipe(
      switchMap((user: User | null) => {
        if (user && user.uid) {
          const projectsCollection = collection(this.firestore, `projects`);
          const q = query(projectsCollection, where('uid', '==', user.uid));
          return collectionData(q, { idField: 'id' }).pipe(
            map(projects => projects as Project[])
          );
        } else {
          return new Observable<Project[]>(observer => {
            observer.next([]);
            observer.complete();
          });
        }
      })
    );
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<any> {
    const user = await this.authService.user$.pipe(map(u => u?.uid)).toPromise();
    if (!user) {
      throw new Error('User not authenticated.');
    }

    const newProject: Omit<Project, 'id'> = {
      ...project,
      uid: user,
      createdAt: new Date(), // Usar new Date() por ahora, serverTimestamp() en Firestore se usa en el backend o en el setDoc/addDoc directamente.
      status: 'En desarrollo' // Estado inicial por defecto
    };

    const projectsCollection = collection(this.firestore, 'projects');
    return addDoc(projectsCollection, { ...newProject, createdAt: serverTimestamp() });
  }

  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    const projectDocRef = doc(this.firestore, `projects/${id}`);
    return updateDoc(projectDocRef, project);
  }

  async deleteProject(id: string): Promise<void> {
    const projectDocRef = doc(this.firestore, `projects/${id}`);
    return deleteDoc(projectDocRef);
  }
}
