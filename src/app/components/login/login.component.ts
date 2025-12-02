import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  template: `
    <div class="container section">
      <div class="login-card card">
        <h2 class="text-center mb-4">Welcome Back</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" formControlName="username" class="form-input" placeholder="Enter your username">
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" formControlName="password" class="form-input" placeholder="Enter your password">
          </div>

          <div *ngIf="error" class="error-message mb-3">
            {{error}}
          </div>

          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            {{loading ? 'Logging in...' : 'Login'}}
          </button>
        </form>

        <div class="text-center mt-3">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-card {
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
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    console.log('Login form submitted');
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form values:', this.loginForm.value);

    if (this.loginForm.invalid) {
      console.log('Form is invalid, not submitting');
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';
    console.log('Calling auth service login...');

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: () => {
          console.log('Login successful!');
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          console.error('Login error:', error);
          this.error = error.error?.message || 'Login failed';
          this.loading = false;
        }
      });
  }
}
