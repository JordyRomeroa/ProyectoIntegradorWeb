import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, user, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc, serverTimestamp, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user$ = user(this.auth);
  }

  async googleSignIn(): Promise<User | null> {
    const provider = new GoogleAuthProvider();
    try {
      const credential = await signInWithPopup(this.auth, provider);
      console.log("Google Sign-in successful:", credential.user);
      // Ensure user data (uid, email, displayName, createdAt) is in Firestore. Role will be determined by getUserRole.
      await this.setUserData(credential.user.uid, credential.user.email || "", undefined, { displayName: credential.user.displayName });
      return credential.user;
    } catch (error) {
      console.error("Google Sign-in failed:", error);
      throw error;
    }
  }

  async registerWithEmailAndPassword(email: string, password: string, initialRole: string = "user", additionalData?: any): Promise<User | null> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      // Set initial user data in Firestore, including the default role if it's a new user.
      await this.setUserData(credential.user.uid, email, initialRole, additionalData);
      return credential.user;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<User | null> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      // For existing users logging in, just ensure their basic data exists if somehow not present.
      // Role will be fetched by getUserRole for redirection.
      await this.setUserData(credential.user.uid, credential.user.email || "");
      return credential.user;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  }

  signOut() {
    return this.auth.signOut();
  }

  async setUserData(uid: string, email: string, role?: string, additionalData?: any): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(userDocRef);

    let dataToSet: any = { email, ...additionalData };

    if (!docSnap.exists()) {
      dataToSet.createdAt = serverTimestamp();
      dataToSet.role = role || "user"; // Assign default role only on creation if not specified
    } else if (role) {
      dataToSet.role = role; // Update role if explicitly provided
    }
    // If doc exists and no role is provided, don't overwrite existing role.

    return setDoc(userDocRef, dataToSet, { merge: true });
  }

  async getUserRole(uid: string): Promise<string> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData && userData["role"]) {
        return userData["role"];
      } else {
        console.log("User document exists but no role found. Assigning default 'user' role.");
        await this.setUserData(uid, userData?.["email"] || 
        // eslint-disable-next-line @typescript-eslint/quotes
        ''
        , "user"); // Assign default 'user' role
        return "user";
      }
    }
    // If user document doesn't exist, create it with default 'user' role and timestamp
    console.log("No user document found. Assigning default 'user' role.");
    await this.setUserData(uid, "", "user"); // Email is not available here, will be set on next login/registration
    return "user";
  }

  async getProgrammers(): Promise<any[]> {
    const usersRef = collection(this.firestore, "users");
    const q = query(usersRef, where("role", "==", "programmer"));
    const querySnapshot = await getDocs(q);
    const programmers: any[] = [];
    querySnapshot.forEach(doc => {
      programmers.push({ uid: doc.id, ...doc.data() });
    });
    return programmers;
  }

  async updateProgrammer(uid: string, data: any): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userDocRef, data);
  }

  async deleteUserAndData(uid: string): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return deleteDoc(userDocRef);
  }

  getAllUsers(): Observable<any[]> {
    const usersRef = collection(this.firestore, "users");
    return collectionData(usersRef, { idField: 'uid' });
  }
}
