import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HamburgerComponent } from '../hamburger/hamburger.component';
import { RouterModule } from '@angular/router';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'nd-sidebar-menu',
  imports: [CommonModule, HamburgerComponent, FontAwesomeModule, RouterModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent {
  public readonly isMenuActive = signal(false);
  public readonly faGithub = faGithub;

  public toggleMenu(): void {
    this.isMenuActive.update((currValue) => !currValue);
  }
}
