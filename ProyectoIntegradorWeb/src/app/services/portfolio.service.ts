import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { Programmer } from '../models/programmer.model';
import { Project } from '../models/project.interface'; // Reutilizamos Project de project.interface.ts
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
          return { uid: doc.id, ...doc.data() } as Programmer;
        });
      })
    );
  }

  getProgrammerById(uid: string): Observable<Programmer | undefined> {
    const programmerDocRef = doc(this.firestore, 'users', uid);
    return from(getDoc(programmerDocRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return { uid: docSnapshot.id, ...docSnapshot.data() } as Programmer;
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
          return { id: doc.id, ...doc.data() } as Project;
        });
      })
    );
  }
}
