import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data["role"];

  return authService.user$.pipe(
    map(user => {
      if (!user) {
        // If no user, redirect to login
        return router.createUrlTree(["/login"]);
      }
      const userRole = authService.getUserRole(user);
      if (expectedRole && userRole !== expectedRole) {
        // If user doesn't have the expected role, redirect to unauthorized or home
        return router.createUrlTree(["/unauthorized"]); // Or a default landing page
      }
      return true;
    })
  );
};
