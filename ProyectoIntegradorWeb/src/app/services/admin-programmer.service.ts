import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Programmer } from '../models/programmer.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminProgrammerService {

  constructor(private firestore: Firestore, private storage: Storage) { }

  // Obtener todos los programadores
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

  // Obtener un programador por ID
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

  // Registrar o actualizar los datos específicos de un programador en Firestore
  async createOrUpdateProgrammerData(uid: string, programmerData: Partial<Programmer>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    // Asegurarse de que el rol sea 'programador' al crear/actualizar desde aquí
    const dataToSet = { ...programmerData, role: 'programador' };
    return setDoc(userDocRef, dataToSet, { merge: true });
  }

  // Eliminar un programador
  async deleteProgrammer(uid: string): Promise<void> {
    const programmerDocRef = doc(this.firestore, `users/${uid}`);
    // Opcional: Eliminar la foto de perfil de Storage si existe (requeriría el photoURL del programador)
    // if (photoURL) {
    //   await this.deleteImage(photoURL);
    // }
    return deleteDoc(programmerDocRef);
  }

  // Subir imagen a Firebase Storage
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = await uploadBytes(storageRef, file);
    return getDownloadURL(uploadTask.ref);
  }

  // Eliminar imagen de Firebase Storage
  async deleteImage(imageUrl: string): Promise<void> {
    const imageRef = ref(this.storage, imageUrl);
    return deleteObject(imageRef);
  }
}
