import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { MarsPhotosService } from '../../services/nasa/mars-photos.service';

@Component({
  selector: 'nd-mars-page',
  imports: [CommonModule],
  templateUrl: './mars-page.component.html',
  styleUrl: './mars-page.component.scss',
})
export class MarsPageComponent {
  constructor(private readonly marsPhotosService: MarsPhotosService) {}
  public readonly faArrowRight = faArrowRight;
}
