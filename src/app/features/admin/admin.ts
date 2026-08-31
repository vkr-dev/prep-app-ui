import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserPublic } from '../../core/models/auth.models';
import { Admin as AdminService } from '../../core/services/admin';
import { LiquidGlassDirective } from '../../shared/liquid-glass.directive';

@Component({
  imports: [DatePipe, RouterLink, LiquidGlassDirective],
  selector: 'app-admin',
  styleUrl: './admin.scss',
  templateUrl: './admin.html',
})
export class Admin implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly users = signal<UserPublic[]>([]);
  // Per-row in-flight state, keyed by user id, so one row's action button
  // doesn't spinner/disable every other row while its own request is out.
  readonly actingOn = signal<Set<number>>(new Set());

  ngOnInit(): void {
    this.fetchUsers();
  }

  approve(user: UserPublic): void {
    this.setActing(user.id, true);
    this.adminService.approve(user.id).subscribe({
      next: () => this.fetchUsers(),
      error: () => {
        this.setActing(user.id, false);
        this.errorMessage.set(`Couldn't approve ${user.email} - try again.`);
      },
    });
  }

  revoke(user: UserPublic): void {
    this.setActing(user.id, true);
    this.adminService.revoke(user.id).subscribe({
      next: () => this.fetchUsers(),
      error: () => {
        this.setActing(user.id, false);
        this.errorMessage.set(`Couldn't revoke ${user.email} - try again.`);
      },
    });
  }

  isActingOn(userId: number): boolean {
    return this.actingOn().has(userId);
  }

  private setActing(userId: number, acting: boolean): void {
    const next = new Set(this.actingOn());
    if (acting) {
      next.add(userId);
    } else {
      next.delete(userId);
    }
    this.actingOn.set(next);
  }

  private fetchUsers(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.loading.set(false);
        this.users.set(users);
        this.actingOn.set(new Set());
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 403
            ? "Owner access required - you're not signed in as the owner."
            : 'Failed to load accounts. Please try again.',
        );
      },
    });
  }
}
