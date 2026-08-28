import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// Route-level gate for UX only (skip the login page if there's no token).
// It cannot be the real authorization boundary - only the backend's DB check
// on every /api/* call can enforce approval status and expiry.
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
