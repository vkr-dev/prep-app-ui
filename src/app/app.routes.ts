import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/login/login';
import { Generate } from './features/generate/generate';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'generate' },
  { path: 'login', component: Login },
  { path: 'generate', component: Generate, canActivate: [authGuard] },
  { path: '**', redirectTo: 'generate' },
];
