import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  templateUrl: './usuario-form.html',
  styleUrls: ['./usuario-form.scss'],
  imports: [ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioFormComponent implements OnInit, OnChanges {
  @Input() usuario: Usuario | null = null;
  @Input() isEditMode = false;
  @Output() submitForm = new EventEmitter<Usuario>();
  @Output() cancel = new EventEmitter<void>();

  usuarioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],   // CORRETO: 'nome'
      email: ['', [Validators.required, Validators.email]],
      idade: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
    });
  }

  ngOnInit(): void {
    if (this.usuario && this.isEditMode) {
      this.usuarioForm.patchValue(this.usuario);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario'] && this.usuario && this.isEditMode) {
      this.usuarioForm.patchValue(this.usuario);
    }
    if (changes['isEditMode'] && !this.isEditMode) {
      this.usuarioForm.reset();
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) return;

    const raw = this.usuarioForm.value;
    const payload: Usuario = {
      ...(this.isEditMode && this.usuario?.id != null ? { id: this.usuario.id } : {}),
      nome: raw.nome,      // CORRETO: 'nome'
      email: raw.email,    // CORRETO: 'email'
      idade: Number(raw.idade),
    };

    this.submitForm.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get nome()  { return this.usuarioForm.get('nome'); }    // CORRETO: 'nome'
  get email() { return this.usuarioForm.get('email'); }
  get idade() { return this.usuarioForm.get('idade'); }
}
