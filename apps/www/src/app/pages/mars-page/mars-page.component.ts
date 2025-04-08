import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarsPhotosStoreService } from '../../services/nasa/mars-photos-store.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ROVER_CAMERAS, ROVERS } from '../../constants/mars-photos';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { MarsRover, RoverCameras } from '../../interfaces/nasa-api/mars-photos';
import { PhotosMosaicComponent } from './photos-mosaic/photos-mosaic.component';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingButtonComponent } from '../../components/loading-button/loading-button.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'nd-mars-page',
  imports: [
    CommonModule,
    SpinnerComponent,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    PhotosMosaicComponent,
    FontAwesomeModule,
    MatInputModule,
    MatDatepickerModule,
    LoadingButtonComponent,
    MatProgressSpinnerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './mars-page.component.html',
  styleUrl: './mars-page.component.scss',
})
export class MarsPageComponent {
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _nasaMarsPhotosService = inject(MarsPhotosStoreService);
  private readonly _fb = inject(FormBuilder);
  private readonly _dialog = inject(MatDialog);

  public readonly _form = this._fb.group({
    rover: this._fb.control<MarsRover | null>(null, [Validators.required]),
    camera: this._fb.control<string | null>(null),
    sol: this._fb.control<number | null>(null),
    earthDate: this._fb.control<Date | null>(null),
  });
  public readonly controls = this._form.controls;
  public readonly selectedRover = this._form.valueChanges.pipe(
    map(({ rover }) => rover?.toLowerCase() as MarsRover)
  );

  public readonly marsPhotos$ = this._nasaMarsPhotosService.marsPhotos$;
  public readonly manifests$ = this._nasaMarsPhotosService.manifests$;
  public readonly isLoaded$ =
    this._nasaMarsPhotosService.hasFetchedInitialData$;

  public readonly rovers = ROVERS;
  public readonly cameras$ = this.selectedRover.pipe(
    map((rover) => (rover ? ROVER_CAMERAS[rover] : []))
  );

  // ICONS
  public readonly faRotateLeft = faRotateLeft;

  public isLoading = false;

  public async fetchPhotos(): Promise<void> {
    this._form.markAllAsTouched();

    if (this._form.invalid) {
      return;
    }

    this.isLoading = true;
    const dialogRef = this._dialog.open(LoadingDialogComponent, {
      disableClose: true,
      panelClass: 'loading-dialog',
    });

    try {
      const value = this._form.getRawValue();
      const { camera, sol, earthDate } = value;
      const rover = value.rover?.toLowerCase() as MarsRover;

      if (!rover) return;

      const roverManifest = await this._nasaMarsPhotosService.getManifest(
        rover
      );
      const lastPhoto = roverManifest.photos.pop();
      const targetDate = earthDate ?? lastPhoto?.earth_date;
      const photos = await this._nasaMarsPhotosService.getPhotos({
        rover: rover,
        camera: camera !== 'All' ? (camera as RoverCameras) : undefined,
        sol: sol ?? undefined,
        earthDate: targetDate ? new Date(targetDate) : undefined,
      });

      this._snackBar.open(
        `Sucessfully fetched ${photos.length} photos!`,
        'Dismiss'
      );
    } catch (err) {
      console.error(err);
      const message =
        err instanceof HttpErrorResponse
          ? err.message
          : 'An unknown error happened. Please try again later.';
      this._snackBar.open(message, 'Dismiss');
    } finally {
      this.isLoading = false;
      dialogRef.close();
    }
  }
}
