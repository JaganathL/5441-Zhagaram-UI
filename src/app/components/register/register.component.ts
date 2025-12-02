import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: false,
    selector: 'app-register',
    template: `
    <div class="container section">
      <div class="register-card card">
        <h2 class="text-center mb-4">Create Account</h2>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" formControlName="username" class="form-input" placeholder="Choose a username">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" formControlName="password" class="form-input" placeholder="Choose a password">
          </div>

          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" formControlName="confirmPassword" class="form-input" placeholder="Confirm your password">
          </div>

          <div *ngIf="error" class="error-message mb-3">
            {{error}}
          </div>

          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            {{loading ? 'Creating Account...' : 'Register'}}
          </button>
        </form>

        <div class="text-center mt-3">
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .register-card {
      max-width: 400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .w-100 {
      width: 100%;
    }

    .error-message {
      color: #ff4444;
      background: rgba(255, 68, 68, 0.1);
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      text-align: center;
    }

    a {
      color: var(--color-primary);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        if (this.authService.currentUserValue) {
            this.router.navigate(['/']);
        }

        this.registerForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.register(this.registerForm.value)
            .subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: error => {
                    this.error = error.error?.message || 'Registration failed';
                    this.loading = false;
                }
            });
    }
}
