import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';

import { AuthService, AuthUser } from '../../../services/auth/auth.service';

// seus componentes (standalone)
import { UsuarioFormComponent} from '../usuario/usuario-form/usuario-form';
import { UsuarioListComponent} from '../usuario/usuario-list/usuario-list';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, UsuarioFormComponent, UsuarioListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  currentUser: AuthUser | null = this.auth.getCurrentUser(); // pega do storage/subject

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
