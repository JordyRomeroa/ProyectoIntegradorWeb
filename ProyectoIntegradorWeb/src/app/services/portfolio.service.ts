import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Programmer } from '../models/programmer.model';
import { Project } from '../models/project.interface';
import { Observable, from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(private firestore: Firestore) { }

  getProgrammers(): Observable<Programmer[]> {
    const programmersCollection = collection(this.firestore, 'users');
    const q = query(programmersCollection, where('role', '==', 'programador'));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            uid: doc.id,
            email: data['email'] || '',
            name: data['name'] || '',
            lastname: data['lastname'] || '',
            specialty: data['specialty'] || '',
            description: data['description'] || '',
            photoURL: data['photoURL'] || '',
            role: data['role'] || 'programador',
            skills: data['skills'] || [],
            contactLinks: data['contactLinks'] || '',
            socialNetworks: data['socialNetworks'] || '',
          } as Programmer;
        });
      })
    );
  }

  getProgrammerById(uid: string): Observable<Programmer | undefined> {
    const programmerDocRef = doc(this.firestore, 'users', uid);
    return from(getDoc(programmerDocRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          return {
            uid: docSnapshot.id,
            email: data['email'] || '',
            name: data['name'] || '',
            lastname: data['lastname'] || '',
            specialty: data['specialty'] || '',
            description: data['description'] || '',
            photoURL: data['photoURL'] || '',
            role: data['role'] || 'programador',
            skills: data['skills'] || [],
            contactLinks: data['contactLinks'] || '',
            socialNetworks: data['socialNetworks'] || '',
          } as Programmer;
        } else {
          return undefined;
        }
      })
    );
  }

  getProjectsByProgrammerId(uid: string): Observable<Project[]> {
    const projectsCollection = collection(this.firestore, 'proyectos');
    const q = query(projectsCollection, where('uid', '==', uid));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            uid: data['uid'] || '',
            name: data['name'] || data['title'] || '', // Mapear 'title' a 'name' si existe
            description: data['description'] || '',
            imageUrl: data['imageUrl'] || '',
            roleInProject: data['roleInProject'] || '',
            technologies: data['technologies'] || [],
            repositoryLink: data['repositoryLink'] || '',
            deployLink: data['deployLink'] || '',
            type: data['type'] || 'Academico', // Default a 'Academico'
            status: data['status'] || 'En desarrollo', // Default a 'En desarrollo'
            createdAt: data['createdAt'] ? data['createdAt'].toDate() : new Date(), // Convertir Timestamp a Date
          } as Project;
        });
      })
    );
  }
}
