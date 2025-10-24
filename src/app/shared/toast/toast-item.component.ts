import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Toast } from './toast.service';

@Component({
  standalone: true,
  selector: 'app-toast-item',
  templateUrl: './toast-item.component.html',
  styleUrls: ['./toast-item.component.scss'],
})
export class ToastItemComponent {
  @Input({ required: true }) toast!: Toast;
  @Output() dismiss = new EventEmitter<number>();

  onDismiss(ev?: Event) {
    ev?.stopPropagation();
    this.dismiss.emit(this.toast.id);
  }
}
