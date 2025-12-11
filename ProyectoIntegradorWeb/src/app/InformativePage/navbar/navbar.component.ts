import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  menuOpen = false;
isLogged = false;
isAdminOrDev = true;

constructor(private router: Router) {}

toggleUserMenu() {
  this.menuOpen = !this.menuOpen;
}

goInicio() { this.router.navigate(['/informative']); }
goProyectos() { this.router.navigate(['/proyectos']); }
goEquipo() { this.router.navigate(['/Equipo']); }
goContacto() { this.router.navigate(['/Contacto']); }
goAsesorias() { this.router.navigate(['/asesoria']); }
goLogin() { this.router.navigate(['/login']); }
goPerfil() { this.router.navigate(['/perfil']); }
goPanel() { this.router.navigate(['/admin']); }

logout() {
  this.isLogged = false;
  this.menuOpen = false;
  alert("Sesión cerrada");
}
}
