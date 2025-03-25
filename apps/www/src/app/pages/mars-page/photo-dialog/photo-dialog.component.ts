import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarsPhotosStoreService } from '../../../services/nasa/mars-photos-store.service';
import { map } from 'rxjs';
import { MatDialogContent } from '@angular/material/dialog';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';

@Component({
  selector: 'nd-photo-dialog',
  imports: [CommonModule, MatDialogContent, SpinnerComponent],
  templateUrl: './photo-dialog.component.html',
  styleUrl: './photo-dialog.component.scss',
})
export class PhotoDialogComponent {
  private readonly _marsPhotosService = inject(MarsPhotosStoreService);

  public readonly selectedPhoto$ = this._marsPhotosService.marsPhotos$.pipe(
    map(
      (photos) =>
        photos.find(
          (photo) => photo.id === this._marsPhotosService.selectedPhotoID()
        ) ?? null
    )
  );

  public formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
