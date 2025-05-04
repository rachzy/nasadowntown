import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HamburgerComponent } from '../hamburger/hamburger.component';
import { RouterModule } from '@angular/router';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { appRoutes } from '../../app.routes';
@Component({
  selector: 'nd-sidebar-menu',
  imports: [CommonModule, HamburgerComponent, FontAwesomeModule, RouterModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss',
})
export class SidebarMenuComponent {
  public readonly isMenuActive = signal(false);
  public readonly faGithub = faGithub;

  public readonly menuButtonId = 'hamburger-button';

  @ViewChild('menuContainer')
  public readonly menuContainer!: ElementRef<HTMLDivElement>;

  public readonly document = inject(DOCUMENT);

  constructor() {
    this.document.body.addEventListener('click', (event) => {
      if (!this.isMenuActive()) return;
      if (!(event.target instanceof HTMLElement)) return;
      const { id } = event.target;
      console.log(id);
      if (id === this.menuButtonId) return;
      if (id === this.menuContainer.nativeElement.id) return;
      this.isMenuActive.set(false);
    });
  }

  public readonly sidebarVisibleAppRoutes = appRoutes.filter(
    (route) => route.showInSidebar
  );

  public toggleMenu(): void {
    this.isMenuActive.update((currValue) => !currValue);
  }
}
