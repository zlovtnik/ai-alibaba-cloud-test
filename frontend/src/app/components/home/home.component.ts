import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="home">
      <h1>Welcome to RCLabs</h1>
      <p>Innovative solutions for modern problems</p>
    </div>
  `,
    styles: [`
    .home {
      text-align: center;
      padding: 2rem;
    }

    h1 {
      font-size: 3rem;
      color: #1a1a1a;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      color: #666;
    }
  `]
})
export class HomeComponent { } 