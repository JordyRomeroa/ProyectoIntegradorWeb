import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    // Ahora sí: se usa después de que auth fue inyectado
    this.user$ = user(this.auth);
  }

  async googleSignIn(): Promise<User | null> {
    const provider = new GoogleAuthProvider();
    try {
      const credential = await signInWithPopup(this.auth, provider);
      console.log("Google Sign-in successful:", credential.user);
      return credential.user;
    } catch (error) {
      console.error("Google Sign-in failed:", error);
      throw error;
    }
  }

  signOut() {
    return this.auth.signOut();
  }

  getUserRole(user: User): string {
    if (user.email === "admin@example.com") return "admin";
    if (user.email === "programmer@example.com") return "programmer";
    return "user";
  }

}
