// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import {ToastContainerComponent} from './shared/toast/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastContainerComponent],
  template: `
    <app-toasts></app-toasts>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  private authService = inject(AuthService);
  title = 'Sistema de Gerenciamento de Usuários';
}
