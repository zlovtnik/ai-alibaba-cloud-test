import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface MenuItem {
  name: string;
  route?: string;
  subItems?: SubMenuItem[];
  isOpen?: boolean;
}

interface SubMenuItem {
  name: string;
  route: string;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('slideIn', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('out', style({
        opacity: 0,
        transform: 'translateX(-20px)'
      })),
      transition('out => in', [
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
      transition('in => out', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ],
  template: `
    <div class="menu-container">
      <div class="burger" (click)="toggleMenu()" [class.active]="isMenuOpen">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <nav class="menu" [class.active]="isMenuOpen">
        <ul class="menu-items">
          <li *ngFor="let item of menuItems; let i = index" 
              [@slideIn]="isMenuOpen ? 'in' : 'out'"
              [style.animation-delay]="(i * 0.1) + 's'">
            <div class="menu-item-header" (click)="toggleSubmenu(item)">
              <a [routerLink]="item.route" routerLinkActive="active" *ngIf="item.route">{{item.name}}</a>
              <span *ngIf="!item.route">{{item.name}}</span>
              <span class="submenu-toggle" *ngIf="item.subItems">
                {{item.isOpen ? '▼' : '▶'}}
              </span>
            </div>
            <ul class="submenu" *ngIf="item.subItems && item.isOpen">
              <li *ngFor="let subItem of item.subItems">
                <a [routerLink]="subItem.route" 
                   routerLinkActive="active"
                   (mouseenter)="hoverEffect($event)" 
                   (mouseleave)="resetEffect($event)">
                  {{subItem.name}}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .menu-container {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
    }

    .burger {
      position: fixed;
      left: 20px;
      top: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 21px;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1001;
    }

    .burger span {
      display: block;
      height: 3px;
      width: 100%;
      background: #ff6b6b;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    }

    .burger:hover {
      transform: scale(1.1);
    }

    .burger:hover span {
      background: #ff5252;
    }

    .burger.active span {
      background: #ff6b6b;
    }

    .burger.active span:nth-child(1) {
      transform: translateY(9px) rotate(45deg);
    }

    .burger.active span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .burger.active span:nth-child(3) {
      transform: translateY(-9px) rotate(-45deg);
    }

    .menu {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      background: #1a1a1a;
      padding: 2rem;
      width: 250px;
      transform: translateX(-100%);
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .menu.active {
      transform: translateX(0);
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    }

    .menu-items {
      list-style: none;
      padding: 0;
      margin: 0;
      margin-top: 80px;
    }

    .menu-items li {
      margin-bottom: 1rem;
    }

    .menu-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    .submenu-toggle {
      color: #ff6b6b;
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }

    .submenu {
      list-style: none;
      padding-left: 1rem;
      margin-top: 0.5rem;
    }

    .submenu li {
      margin-bottom: 0.5rem;
    }

    .menu-items a, .submenu a {
      color: #fff;
      text-decoration: none;
      font-size: 1.1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      display: inline-block;
      padding: 0.3rem 0;
    }

    .menu-items a:hover, .submenu a:hover {
      color: #ff6b6b;
      transform: translateX(10px);
    }

    .menu-items a::before, .submenu a::before {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 0;
      background: #ff6b6b;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .menu-items a:hover::before, .submenu a:hover::before {
      width: 100%;
    }

    .active {
      color: #ff6b6b !important;
    }

    .active::before {
      width: 100% !important;
    }
  `]
})
export class MenuComponent {
  isMenuOpen = false;
  menuItems: MenuItem[] = [
    { name: 'Home', route: '/' },
    { name: 'About', route: '/about' },
    {
      name: 'Services',
      subItems: [
        { name: 'APIs', route: '/services/apis' },
        { name: 'CRUD Operations', route: '/services/crud' }
      ],
      isOpen: false
    },
    { name: 'Contact', route: '/contact' }
  ];

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSubmenu(item: MenuItem) {
    if (item.subItems) {
      item.isOpen = !item.isOpen;
    }
  }

  hoverEffect(event: MouseEvent) {
    const target = event.target as HTMLElement;
    target.style.transform = 'translateX(10px)';
  }

  resetEffect(event: MouseEvent) {
    const target = event.target as HTMLElement;
    target.style.transform = 'translateX(0)';
  }
} 