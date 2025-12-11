import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs'; // Importar from
import { Project } from '../models/project.interface';
import { AuthService } from './auth.service';
import { map, switchMap, first } from 'rxjs/operators';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private firestore: Firestore, private authService: AuthService) { }

  getProjectsByProgrammerId(uid: string): Observable<Project[]> {
    const projectsCollection = collection(this.firestore, `proyectos`);
    const q = query(projectsCollection, where('uid', '==', uid));
    return collectionData(q, { idField: 'id' }).pipe(
      map(projects => projects as Project[])
    );
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt'>, programmerId: string): Promise<any> {
    // El UID del programador se pasa explícitamente
    if (!programmerId) {
      throw new Error('Programmer ID not provided.');
    }

    const newProjectData = {
      ...project,
      uid: programmerId,
      createdAt: serverTimestamp(),
      status: project.status || 'En desarrollo',
      type: project.type || 'Academico',
      technologies: project.technologies || [],
      repositoryLink: project.repositoryLink || '',
      deployLink: project.deployLink || '',
      roleInProject: project.roleInProject || '',
      name: project.name, 
      description: project.description,
      imageUrl: project.imageUrl || '',
    };

    const projectsCollection = collection(this.firestore, 'proyectos');
    return addDoc(projectsCollection, newProjectData);
  }

  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    const projectDocRef = doc(this.firestore, `proyectos/${id}`);
    const updateData: Partial<Project> = {
      name: project.name,
      description: project.description,
      imageUrl: project.imageUrl,
      roleInProject: project.roleInProject,
      technologies: project.technologies,
      repositoryLink: project.repositoryLink,
      deployLink: project.deployLink,
      type: project.type,
      status: project.status,
    };
    return updateDoc(projectDocRef, updateData);
  }

  async deleteProject(id: string): Promise<void> {
    const projectDocRef = doc(this.firestore, `proyectos/${id}`);
    return deleteDoc(projectDocRef);
  }

  getProjectById(id: string): Observable<Project | undefined> {
    const projectDocRef = doc(this.firestore, 'proyectos', id);
    return from(getDoc(projectDocRef)).pipe(
      map((docSnapshot: DocumentSnapshot<any>) => { // Castear docSnapshot
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            uid: data['uid'] || '',
            name: data['name'] || '',
            description: data['description'] || '',
            imageUrl: data['imageUrl'] || '',
            roleInProject: data['roleInProject'] || '',
            technologies: data['technologies'] || [],
            repositoryLink: data['repositoryLink'] || '',
            deployLink: data['deployLink'] || '',
            type: data['type'] || 'Academico',
            status: data['status'] || 'En desarrollo',
            createdAt: data['createdAt'] ? data['createdAt'].toDate() : new Date(),
          } as Project;
        } else {
          return undefined;
        }
      })
    );
  }
}
