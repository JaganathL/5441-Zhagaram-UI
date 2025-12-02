import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="container navbar-container">
        <a routerLink="/" class="navbar-brand">
          Zhagaram Jewellery
        </a>
        
        <div class="navbar-toggle" (click)="toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="navbar-menu" [class.active]="isMenuOpen">
          <a routerLink="/" class="nav-link" (click)="closeMenu()">Home</a>
          <a routerLink="/products" class="nav-link" (click)="closeMenu()">Collection</a>
          <a routerLink="/rentals" class="nav-link" (click)="closeMenu()">Rentals</a>
          
          <ng-container *ngIf="authService.currentUser | async as user; else loginLink">
            <a *ngIf="user.isAdmin" routerLink="/admin" class="nav-link" (click)="closeMenu()">Admin</a>
            <a (click)="logout()" class="nav-link" style="cursor: pointer;">Logout</a>
          </ng-container>
          
          <ng-template #loginLink>
            <a routerLink="/login" class="nav-link" (click)="closeMenu()">Login</a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--color-bg-secondary);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: var(--shadow-md);
      border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-primary);
      text-decoration: none;
      background: var(--gradient-gold);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: var(--color-text-primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      font-size: 1rem;
    }

    .nav-link:hover {
      color: var(--color-primary);
    }

    .navbar-toggle {
      display: none;
      flex-direction: column;
      gap: 6px;
      cursor: pointer;
    }

    .navbar-toggle span {
      width: 25px;
      height: 2px;
      background: var(--color-primary);
      transition: 0.3s;
    }

    @media (max-width: 768px) {
      .navbar-toggle {
        display: flex;
      }

      .navbar-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--color-bg-secondary);
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        transform: translateY(-100%);
        opacity: 0;
        pointer-events: none;
        transition: 0.3s ease;
        border-bottom: 1px solid rgba(212, 175, 55, 0.2);
      }

      .navbar-menu.active {
        transform: translateY(0);
        opacity: 1;
        pointer-events: all;
      }
    }
  `]
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(public authService: AuthService, private router: Router) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
