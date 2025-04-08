import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NdBtnDirective } from '../../directives/btn/nd-btn.directive';
import { ButtonSpinnerComponent } from '../button-spinner/button-spinner.component';

@Component({
  selector: 'nd-loading-button',
  standalone: true,
  imports: [CommonModule, ButtonSpinnerComponent, NdBtnDirective],
  templateUrl: './loading-button.component.html',
  styleUrl: './loading-button.component.scss',
})
export class LoadingButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'invisible' | 'bordered' =
    'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() blocked = false;
  @Input() loading = false;
  @Output() clicked = new EventEmitter<MouseEvent>();
}
