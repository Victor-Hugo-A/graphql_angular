import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <!-- confirm-dialog.component.html -->
    <div class="app-confirm-dialog">
      <h2 class="app-confirm-title">{{ data.title || 'Confirmar' }}</h2>
      <div class="app-confirm-content">{{ data.message || 'Deseja confirmar?' }}</div>
      <div class="app-confirm-actions">
        <button type="button" class="btn btn-ghost" (click)="close(false)">Cancelar</button>
        <button type="button" class="btn btn-danger" (click)="close(true)">{{ data.confirmText || 'OK' }}</button>
      </div>
    </div>

  `,
})
export class ConfirmDialogComponent {
  constructor(
    private ref: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
  close(v: boolean) { this.ref.close(v); }
}
