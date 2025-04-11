import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="brand">
          <span class="brand-name">RC</span>
          <span class="brand-labs">Labs</span>
        </div>
        <div class="social-links">
          <a href="#" class="social-link">GitHub</a>
          <a href="#" class="social-link">LinkedIn</a>
          <a href="#" class="social-link">Twitter</a>
        </div>
        <div class="copyright">
          © {{ currentYear }} RCLabs. All rights reserved.
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      background: #1a1a1a;
      color: #fff;
      padding: 2rem;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .brand {
      display: flex;
      align-items: baseline;
      font-size: 2rem;
      font-weight: bold;
    }

    .brand-name {
      color: #ff6b6b;
    }

    .brand-labs {
      color: #fff;
    }

    .social-links {
      display: flex;
      gap: 1.5rem;
    }

    .social-link {
      color: #fff;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .social-link:hover {
      color: #ff6b6b;
    }

    .copyright {
      font-size: 0.9rem;
      color: #888;
    }
  `]
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
} 