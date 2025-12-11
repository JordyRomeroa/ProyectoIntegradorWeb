import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, from, of } from 'rxjs'; // Añadir of
import { map, take, switchMap } from 'rxjs/operators'; // Añadir switchMap
import { AuthService } from '../services/auth.service';
import { User } from '@angular/fire/auth'; // Importar User

@Injectable({
  providedIn: 'root'
})
export class ExternalUserGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.user$.pipe(
      take(1),
      switchMap((user: User | null) => {
        if (!user) {
          // Si no hay usuario logeado, redirige a la página de login
          return of(this.router.parseUrl('/login')); // Usar of() y parseUrl para el tipo consistente
        }
        // Si hay usuario logeado, verifica su rol
        return from(this.authService.getUserRole(user.uid)).pipe(
          map(role => {
            if (role === 'user') {
              return true;
            } else {
              // Si el rol no es 'user', redirige a una página de no autorizado o al dashboard del rol correspondiente
              return this.router.parseUrl('/unauthorized'); // Usar parseUrl
            }
          })
        );
      })
    );
  }
}
