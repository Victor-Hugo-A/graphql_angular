// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { Usuario } from './models/usuario.model';
import { UsuarioService } from './services/usuario'; // ajuste caso use ./services/usuario.service
import { ErrorHandlerService } from './services/error/error-handler.service';

import { UsuarioFormComponent } from './components/usuario/usuario-form/usuario-form';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsuarioFormComponent,
    UsuarioListComponent,
  ],
})
export class AppComponent implements OnInit {
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

  constructor(
    private usuarioService: UsuarioService,
    private errorHandler: ErrorHandlerService
  ) {
    this.usuarios$ = this.usuarioService.usuarios$; // stream exposta pelo service
  }

  ngOnInit(): void {
    // carrega a lista na montagem
    this.usuarioService.refreshUsuarios();
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
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    this.usuarioService.deleteUsuario(usuarioId).subscribe({
      next: (response: any) => {
        if (response?.errors?.length) {
          const errorMessage = this.errorHandler.handleGraphQLErrors(response.errors);
          this.showNotification(errorMessage, 'error');
          return;
        }

        // Após a mutação, refaça o fetch para consistência entre telas
        this.usuarioService.refreshUsuarios();
        this.showNotification('Usuário excluído com sucesso!', 'success');
      },
      error: (error) => {
        console.error('Erro ao excluir usuário:', error);
        this.showNotification('Erro ao excluir usuário', 'error');
      },
    });
  }

  onSubmitForm(usuario: Usuario): void {
    if (this.isEditMode && usuario.id) {
      // UPDATE
      this.usuarioService.updateUsuario(usuario.id, usuario).subscribe({
        next: (response: any) => {
          try {
            // valida e força erro legível se vierem GraphQL errors
            this.usuarioService.extractDataOrThrow<Usuario>(response, 'atualizarUsuario');

            // Recarrega a lista (fonte única de verdade)
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

            // Recarrega a lista
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

  showNotification(message: string, type: 'success' | 'error'): void {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.show = true;

    setTimeout(() => (this.notification.show = false), 3000);
  }

  // Se quiser usar em *ngFor trackBy no template
  trackById(_index: number, item: Usuario): number {
    return item.id!;
  }
}
