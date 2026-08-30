import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { LiquidGlassDirective } from '../../shared/liquid-glass.directive';

type Mode = 'login' | 'register';

@Component({
  imports: [ReactiveFormsModule, LiquidGlassDirective],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly mode = signal<Mode>('login');
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly infoMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.errorMessage.set(null);
    this.infoMessage.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.infoMessage.set(null);
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();

    if (this.mode() === 'login') {
      this.auth.login({ email, password }).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.status === 'pending') {
            this.infoMessage.set('Logged in - your account is still pending owner approval.');
          } else if (res.status === 'revoked') {
            this.infoMessage.set('Logged in - your access has been revoked.');
          } else {
            this.router.navigate(['/']);
          }
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Invalid email or password.');
        },
      });
      return;
    }

    this.auth.register({ email, password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.infoMessage.set('Registered. Ask the owner to approve your account, then log in.');
        this.setMode('login');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.status === 400 ? 'That email is already registered.' : 'Registration failed.');
      },
    });
  }
}
