import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';

export const programmerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = 'programmer'; // El rol esperado para este guard

  return authService.user$.pipe(
    switchMap(user => {
      if (!user) {
        // Si no hay usuario, redirigir a la página de login
        return of(router.createUrlTree(['/login']));
      }

      // Convertir la promesa devuelta por getUserRole a un Observable
      return from(authService.getUserRole(user.uid)).pipe(
        map(userRole => {
          if (userRole !== expectedRole) {
            // Si el usuario no tiene el rol de programador, redirigir a no autorizado
            return router.createUrlTree(['/unauthorized']);
          }
          return true;
        })
      );
    })
  );
};
