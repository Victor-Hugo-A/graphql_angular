import { Component, EventEmitter, Output, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { Q_TODOS, M_DELETAR } from '../../../../graphql/auth.gql';
import { ToastService} from '../../../../shared/toast/toast.service';
import { Usuario} from '../../../../models/usuario.model';

@Component({
  standalone: true,
  selector: 'app-usuario-list',
  imports: [CommonModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.scss'
})
export class UsuarioListComponent implements OnInit {
  private apollo = inject(Apollo);
  private toast = inject(ToastService);

  usuarios = signal<Usuario[]>([]);
  loading = signal<boolean>(false);

  @Output() countChange = new EventEmitter<number>();
  @Output() novo = new EventEmitter<void>();

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.apollo.watchQuery<{ todosUsuarios: Usuario[] }>({
      query: Q_TODOS,
      fetchPolicy: 'network-only', // pega os 3 que já estão no banco
    }).valueChanges.subscribe({
      next: ({ data }) => {
        const list = data?.todosUsuarios ?? [];
        this.usuarios.set(list);
        this.countChange.emit(list.length);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error(err?.message ?? 'Erro ao carregar usuários.');
      }
    });
  }

  onNovoClick() {
    this.novo.emit();
  }

  async deletar(id: Usuario['id']) {
    try {
      await this.apollo.mutate({
        mutation: M_DELETAR,
        variables: { id },
        fetchPolicy: 'no-cache',
      }).toPromise();
      this.toast.success('Usuário removido.');
      this.load(); // recarrega a lista
    } catch (e: any) {
      this.toast.error(e?.message ?? 'Erro ao remover usuário.');
    }
  }
}
