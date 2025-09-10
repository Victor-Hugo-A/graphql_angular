import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from './models/usuario.model';
import { UsuarioService } from './services/usuario';
import { UsuarioFormComponent } from './components/usuario/usuario-form/usuario-form';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list';
import {ReactiveFormsModule} from '@angular/forms';

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

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.showNotification('Erro ao carregar usuários', 'error');
      }
    });
  }

  onEditUsuario(usuario: Usuario): void {
    this.selectedUsuario = usuario;
    this.isEditMode = true;
    this.showForm = true;
  }

  onNewUsuario(): void {
    this.selectedUsuario = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  onDeleteUsuario(usuarioId: number): void {
    this.usuarioService.deleteUsuario(usuarioId).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== usuarioId);
        this.showNotification('Usuário excluído com sucesso!', 'success');
      },
      error: (error) => {
        console.error('Erro ao excluir usuário:', error);
        this.showNotification('Erro ao excluir usuário', 'error');
      }
    });
  }

  onSubmitForm(usuario: Usuario): void {
    if (this.isEditMode && usuario.id) {
      // @ts-ignore
      this.usuarioService.updateUsuario(usuario).subscribe({
        next: (updatedUsuario) => {
          const index = this.usuarios.findIndex(u => u.id === updatedUsuario.id);
          if (index !== -1) {
            this.usuarios[index] = updatedUsuario;
          }
          this.showForm = false;
          this.showNotification('Usuário atualizado com sucesso!', 'success');
        },
        error: (error) => {
          console.error('Erro ao atualizar usuário:', error);
          this.showNotification('Erro ao atualizar usuário', 'error');
        }
      });
    } else {
      this.usuarioService.createUsuario(usuario).subscribe({
        next: (newUsuario) => {
          this.usuarios.push(newUsuario);
          this.showForm = false;
          this.showNotification('Usuário criado com sucesso!', 'success');
        },
        error: (error) => {
          console.error('Erro ao criar usuário:', error);
          this.showNotification('Erro ao criar usuário', 'error');
        }
      });
    }
  }

  onCancelForm(): void {
    this.showForm = false;
    this.selectedUsuario = null;
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

export class AppModule {
}
