import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Asesoria } from '../models/asesoria.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AsesoriaService {

  constructor(private firestore: Firestore) { }

  async solicitarAsesoria(asesoria: Asesoria): Promise<void> {
    try {
      const collectionRef = collection(this.firestore, 'asesorias');
      await addDoc(collectionRef, asesoria);
      console.log('Solicitud de asesoría registrada con éxito');
    } catch (error) {
      console.error('Error al registrar solicitud de asesoría:', error);
      throw error;
    }
  }

  getAsesoriasByProgrammerId(programmerId: string): Observable<Asesoria[]> {
    const asesoriasCollection = collection(this.firestore, 'asesorias');
    const q = query(asesoriasCollection, where('idProgramador', '==', programmerId));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() } as Asesoria;
        });
      })
    );
  }

  getAsesoriasByUserId(userId: string): Observable<Asesoria[]> {
    const asesoriasCollection = collection(this.firestore, 'asesorias');
    const q = query(asesoriasCollection, where('idUsuario', '==', userId));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() } as Asesoria;
        });
      })
    );
  }
}
