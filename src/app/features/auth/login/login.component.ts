import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  credentials = signal({
    email: '',
    password: ''
  });

  loading = signal(false);
  showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loading()) return;

    this.loading.set(true);

    this.authService.login(this.credentials()).subscribe({
      next: () => {
        this.notificationService.success('¡Bienvenido a ICEMAS!');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading.set(false);
        this.notificationService.error(
          error.message || 'Error al iniciar sesión. Verifica tus credenciales.'
        );
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
