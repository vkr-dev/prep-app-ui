import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { ownerGuard } from './core/guards/owner-guard';
import { Login } from './features/login/login';
import { Search } from './features/search/search';
import { Generate } from './features/generate/generate';
import { Admin } from './features/admin/admin';

export const routes: Routes = [
  { path: '', component: Search, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'generate', component: Generate, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [authGuard, ownerGuard] },
  { path: '**', redirectTo: '' },
];
