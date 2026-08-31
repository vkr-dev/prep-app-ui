import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// Route-level gate for UX only, same caveat as auth-guard.ts: it just keeps
// a non-owner from landing on a page with nothing they can use (every call
// on it 403s server-side via require_owner regardless). Redirects to '/'
// rather than '/login' since a non-owner here is still logged in - they're
// just not the owner.
export const ownerGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.currentStatus() === 'owner') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
