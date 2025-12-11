import { Component, OnInit } from '@angular/core'; // Añadir OnInit
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Importar AuthService
import { Observable, of, from } from 'rxjs'; // Importar Observable, of y from
import { switchMap, map } from 'rxjs/operators'; // Importar switchMap y map
import { User } from '@angular/fire/auth'; // Importar User
import { CommonModule } from '@angular/common'; // Importar CommonModule explícitamente

@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin.sidebar.component.html',
  styleUrls: ['./admin.sidebar.component.css'],
  standalone: true,
  imports: [CommonModule] // Añadir CommonModule aquí
})
export class AdminSidebarComponent implements OnInit {

  isAdmin$: Observable<boolean> | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAdmin$ = this.authService.user$.pipe(
      switchMap((user: User | null) => {
        if (user) {
          return from(this.authService.getUserRole(user.uid)).pipe(
            map(role => role === 'admin')
          );
        }
        return of(false);
      })
    );
  }

  nav(route: string) {
    this.router.navigate([`/admin/${route}`]);
  }

  go(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }
}
