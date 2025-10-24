import { Component, computed, inject } from '@angular/core';
import { ToastService } from './toast.service';
import { ToastItemComponent } from './toast-item.component';

@Component({
  standalone: true,
  selector: 'app-toasts',
  imports: [ToastItemComponent],
  templateUrl: './toast-container.component.html',   // ✅ este é o HTML do container
  styleUrls: ['./toast-container.component.scss']
})
export class ToastContainerComponent {
  private toast = inject(ToastService);
  toasts = computed(() => this.toast.toasts());
  dismiss = (id: number) => this.toast.dismiss(id);
}
