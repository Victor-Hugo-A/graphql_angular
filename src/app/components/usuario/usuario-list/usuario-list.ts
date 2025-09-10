import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './usuario-list.html',
  styleUrls: ['./usuario-list.scss']
})
export class UsuarioListComponent implements OnInit {
  @Input() usuarios: Usuario[] = [];
  @Output() edit = new EventEmitter<Usuario>();
  @Output() delete = new EventEmitter<number>();
  @Output() newUser = new EventEmitter<void>();

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
      }
    });
  }

  onEditar(usuario: Usuario): void {
    this.edit.emit(usuario);
  }

  onExcluir(usuarioId: number | undefined): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.delete.emit(usuarioId);
    }
  }

  onNovoUsuario(): void {
    this.newUser.emit();
  }
}
