import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from './models/usuario.model';
import { UsuarioService } from './services/usuario';
import { UsuarioFormComponent } from './components/usuario/usuario-form/usuario-form';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list';
import { ReactiveFormsModule } from '@angular/forms';
import { GetUsuariosResponse } from './types/graphql.types'; // ← Removido CreateUsuarioResponse não utilizado
import { ErrorHandlerService } from './services/error/error-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [
    CommonModule,
    UsuarioFormComponent,
    UsuarioListComponent,
    ReactiveFormsModule
  ],
})
export class AppComponent implements OnInit {
  usuarios: Usuario[] = [];
  selectedUsuario: Usuario | null = null;
  showForm: boolean = false;
  isEditMode: boolean = false;

  notification = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
  };

  constructor(
    private usuarioService: UsuarioService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (response: GetUsuariosResponse) => {
        if (response.errors && response.errors.length > 0) {
          console.error('Erros ao carregar usuários:', response.errors);
          this.showNotification('Erro ao carregar usuários', 'error');
          this.usuarios = [];
          return;
        }

        this.usuarios = Array.isArray(response?.data?.todosUsuarios)
          ? response.data.todosUsuarios
          : [];
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.showNotification('Erro ao carregar usuários', 'error');
        this.usuarios = [];
      }
    });
  }

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

  onDeleteUsuario(usuarioId: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.deleteUsuario(usuarioId).subscribe({
        next: (response: any) => {
          if (response.errors && response.errors.length > 0) {
            // ✅ CORREÇÃO: Use errorHandler em vez do método que não existe
            const errorMessage = this.errorHandler.handleGraphQLErrors(response.errors);
            this.showNotification(errorMessage, 'error');
            return;
          }
          this.usuarios = this.usuarios.filter(u => u.id !== usuarioId);
          this.showNotification('Usuário excluído com sucesso!', 'success');
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          this.showNotification('Erro ao excluir usuário', 'error');
        }
      });
    }
  }

  onSubmitForm(usuario: Usuario): void {
    if (this.isEditMode && usuario.id) {
      this.usuarioService.updateUsuario(usuario.id, usuario).subscribe({
        next: (response: any) => {
          // ✅ CORREÇÃO: Use extractDataOrThrow para tipo seguro
          try {
            const updatedUsuario = this.usuarioService.extractDataOrThrow<Usuario>(response, 'atualizarUsuario');
            const index = this.usuarios.findIndex(u => u.id === updatedUsuario.id);
            if (index !== -1) {
              this.usuarios = [
                ...this.usuarios.slice(0, index),
                updatedUsuario,
                ...this.usuarios.slice(index + 1)
              ];
            }
            this.resetForm();
            this.showNotification('Usuário atualizado com sucesso!', 'success');
          } catch (error: any) {
            this.showNotification(error.message, 'error');
          }
        },
        error: (error) => {
          const errorMessage = this.errorHandler.handleGraphQLErrors([error]);
          this.showNotification(errorMessage, 'error');
        }
      });
    } else {
      this.usuarioService.createUsuario(usuario).subscribe({
        next: (response: any) => {
          try {
            // ✅ CORREÇÃO: Especifique o tipo genérico <Usuario>
            const newUsuario = this.usuarioService.extractDataOrThrow<Usuario>(response, 'criarUsuario');
            this.usuarios = [...this.usuarios, newUsuario];
            this.showNotification('Usuário criado com sucesso!', 'success');
            this.resetForm();
          } catch (error: any) {
            this.showNotification(error.message, 'error');
          }
        },
        error: (error) => {
          const errorMessage = this.errorHandler.handleGraphQLErrors([error]);
          this.showNotification(errorMessage, 'error');
        }
      });
    }
  }

  onCancelForm(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.showForm = false;
    this.selectedUsuario = null;
    this.isEditMode = false;
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.show = true;

    setTimeout(() => {
      this.notification.show = false;
    }, 3000);
  }
}
