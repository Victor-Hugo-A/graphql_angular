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
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      idade: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
    });
  }

  ngOnInit(): void {
    // Se já vier preenchido ao montar
    if (this.usuario && this.isEditMode) {
      this.usuarioForm.patchValue(this.usuario);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Se mudar o usuário selecionado depois que o componente já montou
    if (changes['usuario'] && this.usuario && this.isEditMode) {
      this.usuarioForm.patchValue(this.usuario);
    }
    if (changes['isEditMode'] && !this.isEditMode) {
      // Se sair do modo edição, limpa o form
      this.usuarioForm.reset();
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) return;

    const raw = this.usuarioForm.value;
    const payload: Usuario = {
      // Só inclui id em edição; não envie 0 em criação
      ...(this.isEditMode && this.usuario?.id != null ? { id: this.usuario.id } : {}),
      nome: raw.nome,
      email: raw.email,
      idade: Number(raw.idade), // garante número
    };

    this.submitForm.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get nome()  { return this.usuarioForm.get('nome');  }
  get email() { return this.usuarioForm.get('email'); }
  get idade() { return this.usuarioForm.get('idade'); }
}
