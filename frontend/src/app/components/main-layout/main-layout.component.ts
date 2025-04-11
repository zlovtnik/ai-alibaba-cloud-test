import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, MenuComponent, FooterComponent],
    template: `
    <div class="layout">
      <app-menu></app-menu>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
    styles: [`
    .layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .content {
      flex: 1;
      padding: 2rem;
      margin-left: 250px; /* Match menu width */
    }
  `]
})
export class MainLayoutComponent { } 