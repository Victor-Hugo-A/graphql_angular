import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';
export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  timeoutMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();
  private counter = 0;

  show(type: ToastType, message: string, timeoutMs = 3500) {
    const id = ++this.counter;
    const toast: Toast = { id, type, message, timeoutMs };
    this._toasts.update(list => [toast, ...list]);
    if (timeoutMs > 0) {
      setTimeout(() => this.dismiss(id), timeoutMs);
    }
  }

  success(msg: string, timeoutMs = 3500) { this.show('success', msg, timeoutMs); }
  error(msg: string, timeoutMs = 4500) { this.show('error', msg, timeoutMs); }
  info(msg: string, timeoutMs = 3500) { this.show('info', msg, timeoutMs); }

  dismiss(id: number) {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  clearAll() {
    this._toasts.set([]);
  }
}
