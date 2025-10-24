// src/app/components/pages/dashboard/dashboard.component.ts
import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService, AuthUser } from '../../../services/auth/auth.service';
import { UsuarioFormComponent} from '../usuario/usuario-form/usuario-form';
import { UsuarioListComponent} from '../usuario/usuario-list/usuario-list';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, UsuarioFormComponent, UsuarioListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Referência ao card do formulário (para dar foco/scroll ao criar novo)
  @ViewChild('formSection', { read: ElementRef }) formSection?: ElementRef<HTMLElement>;

  currentUser: AuthUser | null = this.auth.getCurrentUser();

  // ✅ usado no template
  totalUsuarios = 0;

  // chamado pelo output da lista
  onCountChange(count: number) {
    this.totalUsuarios = count ?? 0;
  }

  // chamado pelo (novo) da lista
  focusNovo() {
    // rola suavemente até o card do formulário
    this.formSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
