import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nd-hamburger',
  imports: [CommonModule],
  templateUrl: './hamburger.component.html',
  styleUrl: './hamburger.component.scss',
})
export class HamburgerComponent {
  public readonly isActive = input<boolean>();
  public readonly onClick = input<VoidFunction>();

  public readonly id = input.required<string>();
}
