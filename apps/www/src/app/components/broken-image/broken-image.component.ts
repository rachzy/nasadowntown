import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'nd-broken-image',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './broken-image.component.html',
  styleUrl: './broken-image.component.scss',
})
export class BrokenImageComponent {
  @Input() width = '100%';
  @Input() height = '100%';
  @Input() iconSize = 'text-4xl';

  protected readonly faTimes = faTimes;
}
