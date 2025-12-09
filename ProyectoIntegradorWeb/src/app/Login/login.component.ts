import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Corrected path
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  nombre: string = '';
  apellido: string = '';
  verPassword: string = '';
  errorMsg: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;
  showLogin: boolean = true; // To toggle between login and register forms
  showResetModal: boolean = false;
  resetMsg: string = '';

  constructor(private authService: AuthService, private router: Router, private auth: Auth) { }

  async login() {
    this.errorMsg = '';
    this.emailError = false;
    this.passwordError = false;

    try {
      const credential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log("Email/Password Sign-in successful:", credential.user);
      // Implement role-based redirection here
      this.router.navigate(["/dashboard"]); // Placeholder, will be replaced with role-based routing
    } catch (error: any) {
      this.errorMsg = this.getFirebaseErrorMessage(error.code);
      if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
        this.emailError = true;
      } else if (error.code === 'auth/wrong-password') {
        this.passwordError = true;
      }
      console.error("Email/Password Sign-in failed:", error);
    }
  }

  async register() {
    this.errorMsg = '';
    if (this.password !== this.verPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      console.log("Registration successful:", credential.user);
      // Optionally, set initial role or navigate to a profile setup page
      this.router.navigate(["/dashboard"]); // Placeholder
    } catch (error: any) {
      this.errorMsg = this.getFirebaseErrorMessage(error.code);
      console.error("Registration failed:", error);
    }
  }

  async loginWithGoogle() {
    try {
      const user = await this.authService.googleSignIn();
      if (user) {
        console.log("Google login successful, user:", user);
        // Implement role-based redirection here
        this.router.navigate(["/dashboard"]); // Placeholder
      }
    } catch (error) {
      this.errorMsg = 'Error al iniciar sesión con Google.';
      console.error("Google Sign-in failed in component:", error);
    }
  }

  async forgotPassword() {
    if (!this.email) {
      this.resetMsg = 'Por favor, introduce tu correo electrónico.';
      this.showResetModal = true;
      return;
    }
    try {
      await sendPasswordResetEmail(this.auth, this.email);
      this.resetMsg = 'Se ha enviado un correo electrónico para restablecer tu contraseña.';
      this.showResetModal = true;
    } catch (error: any) {
      this.resetMsg = this.getFirebaseErrorMessage(error.code);
      this.showResetModal = true;
      console.error("Forgot password failed:", error);
    }
  }

  showRegisterForm() {
    this.showLogin = false;
    this.errorMsg = '';
  }

  showLoginForm() {
    this.showLogin = true;
    this.errorMsg = '';
  }

  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'El formato del correo electrónico es inválido.';
      case 'auth/user-disabled':
        return 'El usuario ha sido deshabilitado.';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo electrónico.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/operation-not-allowed':
        return 'La autenticación por correo y contraseña no está habilitada.';
      default:
        return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
    }
  }
}
