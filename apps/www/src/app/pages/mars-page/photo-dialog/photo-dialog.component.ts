import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MarsPhotosStoreService } from '../../../services/nasa/mars-photos-store.service';
import { firstValueFrom, fromEvent } from 'rxjs';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SpinnerComponent } from '../../../components/spinner/spinner.component';
import {
  FaIconComponent,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'nd-photo-dialog',
  imports: [
    CommonModule,
    MatDialogContent,
    SpinnerComponent,
    FaIconComponent,
    FontAwesomeModule,
  ],
  templateUrl: './photo-dialog.component.html',
  styleUrl: './photo-dialog.component.scss',
})
export class PhotoDialogComponent {
  private readonly _marsPhotosService = inject(MarsPhotosStoreService);
  private readonly _dialogRef = inject(MatDialogRef);
  private readonly _document = inject(DOCUMENT);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _keydown = fromEvent<KeyboardEvent>(
    this._document,
    'keydown'
  );

  protected readonly _faChevronLeft = faChevronLeft;
  protected readonly _faChevronRight = faChevronRight;

  constructor() {
    const actions: Record<string, () => void> = {
      Escape: () => this.closeDialog(),
      ArrowLeft: () => this.handleSwitchSelectedPhoto(-1),
      ArrowRight: () => this.handleSwitchSelectedPhoto(1),
    };

    this._keydown
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((event) => {
        if (actions[event.key]) {
          actions[event.key]();
        }
      });
  }

  public readonly selectedPhoto = computed(() =>
    this._marsPhotosService
      .marsPhotos()
      .find((photo) => photo.id === this._marsPhotosService.selectedPhotoID())
  );

  protected readonly faTimes = faTimes;

  public formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  public async handleSwitchSelectedPhoto(direction: 1 | -1): Promise<void> {
    const photos = await firstValueFrom(this._marsPhotosService.marsPhotos$);
    const selectedPhotoID = this._marsPhotosService.selectedPhotoID();
    const newSelectedPhotoID =
      photos.findIndex((photo) => photo.id === selectedPhotoID) + direction;

    if (newSelectedPhotoID < 0 || newSelectedPhotoID >= photos.length) return;

    this._marsPhotosService.selectedPhotoID.set(photos[newSelectedPhotoID].id);
  }

  public closeDialog(): void {
    this._dialogRef.close();
  }
}
