import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService} from '../../../../services/auth/auth.service';
import { ToastService } from '../../../../shared/toast/toast.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  loading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  invalid(name: 'email'|'password') {
    const c = this.loginForm.get(name);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toast.info('Preencha e corrija os campos destacados.');
      return;
    }
    this.loading = true;
    const { email, password } = this.loginForm.getRawValue()!;
    try {
      await this.auth.login(email!, password!);
      this.toast.success('Login realizado com sucesso!');
      this.router.navigateByUrl('/user');
    } catch (e: any) {
      this.toast.error(e?.message || 'Credenciais inválidas.');
    } finally {
      this.loading = false;
    }
  }
}
