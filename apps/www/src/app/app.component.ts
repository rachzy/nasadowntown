import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';

@Component({
  imports: [CommonModule, SidebarMenuComponent, RouterOutlet],
  selector: 'nd-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Nasa Downtown';
}
