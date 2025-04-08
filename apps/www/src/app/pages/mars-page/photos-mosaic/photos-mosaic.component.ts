import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NasaAPIMarsPhoto } from '../../../interfaces/nasa-api/mars-photos';
import { MarsPhotosStoreService } from '../../../services/nasa/mars-photos-store.service';
import { MatDialog } from '@angular/material/dialog';
import { PhotoDialogComponent } from '../photo-dialog/photo-dialog.component';
import { BrokenImageComponent } from '../../../components/broken-image/broken-image.component';

@Component({
  selector: 'nd-photos-mosaic',
  standalone: true,
  imports: [CommonModule, BrokenImageComponent],
  templateUrl: './photos-mosaic.component.html',
  styleUrl: './photos-mosaic.component.scss',
})
export class PhotosMosaicComponent {
  private readonly _nasaMarsPhotosService = inject(MarsPhotosStoreService);
  private readonly _matDialogService = inject(MatDialog);

  public readonly photos = input.required<NasaAPIMarsPhoto[]>();
  public readonly photosByDate = computed<Record<string, NasaAPIMarsPhoto[]>>(
    () =>
      this.photos().reduce<Record<string, NasaAPIMarsPhoto[]>>((acc, curr) => {
        const date = new Date(curr.earth_date);
        const dateKey = date.getTime().toString();
        return {
          ...acc,
          [dateKey]: [...(acc[dateKey] ?? []), curr],
        };
      }, {})
  );

  public readonly dates = computed(() => Object.keys(this.photosByDate()));

  public formatDate(date: string): string {
    const dateObj = new Date(parseInt(date));
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  public openPhotoDialog(photoID: number): void {
    this._nasaMarsPhotosService.selectedPhotoID.set(photoID);
    this._matDialogService.open(PhotoDialogComponent);
  }
}
