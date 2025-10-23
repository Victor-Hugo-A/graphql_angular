import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: ['', [Validators.min(1), Validators.max(120)]],
      role: ['User', [Validators.required]],
      title: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';

      const formValue = this.registerForm.value;
      const registerData = {
        name: formValue.name,     // Mantém em inglês no form
        email: formValue.email,
        password: formValue.password,
        age: formValue.age || 0   // Mantém em inglês no form
      };

      this.authService.register(registerData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/user']);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Erro no registro. Tente novamente.';
          console.error('Registration error:', error);
        }
      });
    }
  }
}
