import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Asesoria } from '../models/asesoria.model';
import { Schedule } from '../models/schedule.model'; // Importar el modelo Schedule
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

  // Métodos para la gestión de horarios de programadores

  async createSchedule(schedule: Schedule): Promise<void> {
    try {
      const collectionRef = collection(this.firestore, 'schedules');
      await addDoc(collectionRef, schedule);
      console.log('Horario registrado con éxito');
    } catch (error) {
      console.error('Error al registrar horario:', error);
      throw error;
    }
  }

  getSchedulesByProgrammerId(programmerId: string): Observable<Schedule[]> {
    const schedulesCollection = collection(this.firestore, 'schedules');
    const q = query(schedulesCollection, where('programmerId', '==', programmerId));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() } as Schedule;
        });
      })
    );
  }

  async updateSchedule(scheduleId: string, schedule: Partial<Schedule>): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'schedules', scheduleId);
      await updateDoc(docRef, schedule);
      console.log('Horario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar horario:', error);
      throw error;
    }
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'schedules', scheduleId);
      await deleteDoc(docRef);
      console.log('Horario eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      throw error;
    }
  }
}
