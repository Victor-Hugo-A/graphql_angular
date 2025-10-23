// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/user.service';
import { ErrorHandlerService } from '../../services/error/error-handler.service';
import { AuthService } from '../../services/auth/auth.service';

import { UsuarioFormComponent } from '../usuario/usuario-form/usuario-form';
import { UsuarioListComponent } from '../usuario/usuario-list/usuario-list';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsuarioFormComponent,
    UsuarioListComponent,
    MatDialogModule,
    RouterModule
  ],
})
export class DashboardComponent implements OnInit {
  // Lista vinda do service (store reativo)
  usuarios$!: Observable<Usuario[]>;

  // Controle de UI
  selectedUsuario: Usuario | null = null;
  showForm = false;
  isEditMode = false;

  // Toast simples
  notification = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  };

  // Serviços
  private usuarioService = inject(UsuarioService);
  private errorHandler = inject(ErrorHandlerService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  constructor() {
    this.usuarios$ = this.usuarioService.usuarios$;
  }

  ngOnInit(): void {
    // Só carrega usuários se estiver autenticado
    if (this.isAuthenticated) {
      this.usuarioService.refreshUsuarios();
    }
  }

  // ========= Propriedades de Autenticação =========
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  // ========= Ações de Autenticação =========
  logout(): void {
    this.authService.logout();
    this.resetUI();
  }

  // ========= Ações de UI =========
  onEditUsuario(usuario: Usuario): void {
    this.selectedUsuario = { ...usuario };
    this.isEditMode = true;
    this.showForm = true;
  }

  onNewUsuario(): void {
    this.selectedUsuario = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  onCancelForm(): void {
    this.resetForm();
  }

  // ========= CRUD =========
  onDeleteUsuario(usuarioId: number): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir usuário',
        message: 'Tem certeza que deseja excluir este usuário?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      },
      panelClass: 'confirm-dialog-panel',
      backdropClass: 'confirm-dialog-backdrop',
      disableClose: true,
    }).afterClosed().subscribe((ok: any) => {
      if (!ok) return;

      this.usuarioService.deleteUsuario(usuarioId).subscribe({
        next: (response: any) => {
          if (response?.errors?.length) {
            const msg = this.errorHandler.handleGraphQLErrors(response.errors);
            this.showNotification(msg, 'error');
            return;
          }
          this.usuarioService.refreshUsuarios();
          this.showNotification('Usuário excluído com sucesso!', 'success');
        },
        error: () => this.showNotification('Erro ao excluir usuário', 'error'),
      });
    });
  }

  onSubmitForm(usuario: Usuario): void {
    if (this.isEditMode && usuario.id) {
      // UPDATE
      this.usuarioService.updateUsuario(usuario.id, usuario).subscribe({
        next: (response: any) => {
          try {
            this.usuarioService.extractDataOrThrow<Usuario>(response, 'atualizarUsuario');
            this.usuarioService.refreshUsuarios();
            this.resetForm();
            this.showNotification('Usuário atualizado com sucesso!', 'success');
          } catch (error: any) {
            this.showNotification(error.message, 'error');
          }
        },
        error: (error) => {
          const errorMessage = this.errorHandler.handleGraphQLErrors([error]);
          this.showNotification(errorMessage, 'error');
        },
      });
    } else {
      // CREATE
      this.usuarioService.createUsuario(usuario).subscribe({
        next: (response: any) => {
          try {
            this.usuarioService.extractDataOrThrow<Usuario>(response, 'criarUsuario');
            this.usuarioService.refreshUsuarios();
            this.resetForm();
            this.showNotification('Usuário criado com sucesso!', 'success');
          } catch (error: any) {
            this.showNotification(error.message, 'error');
          }
        },
        error: (error) => {
          const errorMessage = this.errorHandler.handleGraphQLErrors([error]);
          this.showNotification(errorMessage, 'error');
        },
      });
    }
  }

  // ========= Utilitários =========
  private resetForm(): void {
    this.showForm = false;
    this.selectedUsuario = null;
    this.isEditMode = false;
  }

  private resetUI(): void {
    this.resetForm();
    this.notification = { ...this.notification, show: false };
  }

  showNotification(message: string, type: 'success'|'error') {
    this.notification = { ...this.notification, message, type, show: true };
    setTimeout(() => {
      this.notification = { ...this.notification, show: false };
    }, 3000);
  }

  trackById(_index: number, item: Usuario): number {
    return item.id!;
  }
}
