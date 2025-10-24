// src/app/shared/toast/toast-container.component.ts
import { Component, computed, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  standalone: true,
  selector: 'app-toasts',
  imports: [NgFor, NgClass],
  template: `
    <div class="toast-wrap">
      <div
        class="toast"
        *ngFor="let t of toasts()"
        [ngClass]="{
          'toast--success': t.type === 'success',
          'toast--error': t.type === 'error',
          'toast--info': t.type === 'info'
        }"
        (click)="dismiss(t.id)"
        role="status"
        aria-live="polite"
      >
        <span class="dot"></span>
        <span class="msg">{{ t.message }}</span>
        <button class="close" aria-label="Fechar" (click)="dismiss(t.id); $event.stopPropagation()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-wrap {
      position: fixed;
      top: 16px;
      right: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
      pointer-events: none; /* permite clicar no conteúdo abaixo */
    }
    .toast {
      pointer-events: auto; /* mas o próprio toast pode ser clicado */
      min-width: 280px;
      max-width: 420px;
      display: grid;
      grid-template-columns: 10px 1fr auto;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0,0,0,.15);
      color: #0b0b12;
      background: #fff;
      border-left: 4px solid transparent;
      animation: slideIn .18s ease-out;
      font: 500 14px/1.35 system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
    }
    .toast--success { border-left-color: #12b981; }
    .toast--error   { border-left-color: #ef4444; }
    .toast--info    { border-left-color: #3b82f6; }

    .dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: currentColor;
    }
    .toast--success .dot { color: #12b981; }
    .toast--error   .dot { color: #ef4444; }
    .toast--info    .dot { color: #3b82f6; }

    .msg { white-space: pre-wrap; }
    .close {
      appearance: none;
      border: 0;
      background: transparent;
      color: #6b7280;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      padding: 0 4px;
    }
    .close:hover { color: #111827; }

    @keyframes slideIn {
      from { transform: translateY(-8px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
  `]
})
export class ToastContainerComponent {
  private toast = inject(ToastService);
  toasts = computed(() => this.toast.toasts());
  dismiss = (id: number) => this.toast.dismiss(id);
}
