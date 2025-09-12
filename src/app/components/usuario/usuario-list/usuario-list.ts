import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  templateUrl: './usuario-list.html',
  styleUrls: ['./usuario-list.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioListComponent implements OnInit {
  @Input() usuarios: Usuario[] = []; // recebe do pai (AppComponent)
  @Output() edit = new EventEmitter<Usuario>();
  @Output() delete = new EventEmitter<number>();
  @Output() newUser = new EventEmitter<void>();

  ngOnInit(): void {
    // Nenhum fetch aqui — lista 100% apresentacional
  }

  onEditar(usuario: Usuario): void {
    this.edit.emit(usuario);
  }

  onExcluir(usuarioId?: number): void {
    if (usuarioId == null) return; // evita undefined
      this.delete.emit(usuarioId);
  }

  onNovoUsuario(): void {
    this.newUser.emit();
  }

  trackById(_i: number, u: Usuario) {
    return u.id ?? _i;
  }
}
