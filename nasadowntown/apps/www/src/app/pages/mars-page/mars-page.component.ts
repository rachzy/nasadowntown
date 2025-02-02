import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarsPhotosStoreService } from '../../services/nasa/mars-photos-store.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'nd-mars-page',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './mars-page.component.html',
  styleUrl: './mars-page.component.scss',
})
export class MarsPageComponent {
  private readonly _nasaMarsPhotosService = inject(MarsPhotosStoreService);

  public readonly marsPhotos$ = this._nasaMarsPhotosService.marsPhotos$;
  public readonly manifests$ = this._nasaMarsPhotosService.manifests$;

  public readonly isLoaded$ =
    this._nasaMarsPhotosService.hasFetchedInitialData$;
}
