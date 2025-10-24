import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService} from '../../../../services/auth/auth.service';
import { ToastService } from '../../../../shared/toast/toast.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  loading = false;

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  invalid(name: 'name'|'email'|'password') {
    const c = this.registerForm.get(name);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.info('Preencha e corrija os campos destacados.');
      return;
    }
    this.loading = true;
    const { name, email, password } = this.registerForm.getRawValue()!;
    try {
      await this.auth.register(name!, email!, password!);
      this.toast.success('Conta criada com sucesso! Você já está logado.');
      this.router.navigateByUrl('/');
    } catch (e: any) {
      this.toast.error(e?.message || 'Erro ao criar a conta.');
    } finally {
      this.loading = false;
    }
  }
}
