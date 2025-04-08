import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonSpinnerComponent } from '../button-spinner/button-spinner.component';

@Component({
  selector: 'nd-loading-dialog',
  standalone: true,
  imports: [CommonModule, ButtonSpinnerComponent],
  templateUrl: './loading-dialog.component.html',
  styleUrl: './loading-dialog.component.scss',
})
export class LoadingDialogComponent {}
