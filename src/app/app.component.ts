import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer class="footer">
      <div class="container text-center">
        <p>&copy; 2024 Zhagaram Jewellery. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 140px);
    }
    
    .footer {
      background: var(--color-bg-secondary);
      padding: 2rem 0;
      margin-top: 4rem;
      border-top: 1px solid rgba(212, 175, 55, 0.2);
    }
  `]
})
export class AppComponent { }
