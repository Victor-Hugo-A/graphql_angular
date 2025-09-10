import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Usuario } from '../../../models/usuario.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  templateUrl: './usuario-form.html',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./usuario-form.scss']
})
export class UsuarioFormComponent implements OnInit {
  @Input() usuario: Usuario | null = null;
  @Input() isEditMode: boolean = false;
  @Output() submitForm = new EventEmitter<Usuario>();
  @Output() cancel = new EventEmitter<void>();

  usuarioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      idade: ['', [Validators.required, Validators.min(1), Validators.max(120)]]
    });
  }

  ngOnInit(): void {
    if (this.usuario && this.isEditMode) {
      this.usuarioForm.patchValue(this.usuario);
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const usuarioData: Usuario = {
        ...this.usuarioForm.value,
        id: this.usuario?.id || 0
      };
      this.submitForm.emit(usuarioData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get nome() { return this.usuarioForm.get('nome'); }
  get email() { return this.usuarioForm.get('email'); }
  get idade() { return this.usuarioForm.get('idade'); }
}
