import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, switchMap } from 'rxjs/operators'; // Import switchMap
import { of, from } from 'rxjs'; // Import from for Promises

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data["role"];

  return authService.user$.pipe(
    switchMap(user => { // Use switchMap to handle the inner Observable
      if (!user) {
        // If no user, redirect to login
        return of(router.createUrlTree(["/login"]));
      }
      
      // Convert the Promise returned by getUserRole to an Observable
      return from(authService.getUserRole(user.uid)).pipe(
        map(userRole => {
          if (expectedRole && userRole !== expectedRole) {
            // If user doesn't have the expected role, redirect to unauthorized or home
            return router.createUrlTree(["/unauthorized"]); // Or a default landing page
          }
          return true;
        })
      );
    })
  );
};
