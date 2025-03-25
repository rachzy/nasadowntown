import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarsPhotosStoreService } from '../../services/nasa/mars-photos-store.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ROVERS } from '../../constants/mars-photos';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PhotoDialogComponent } from './photo-dialog/photo-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'nd-mars-page',
  imports: [
    CommonModule,
    SpinnerComponent,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './mars-page.component.html',
  styleUrl: './mars-page.component.scss',
})
export class MarsPageComponent {
  private readonly _nasaMarsPhotosService = inject(MarsPhotosStoreService);
  private readonly _matDialogService = inject(MatDialog);
  private readonly _fb = inject(FormBuilder);

  public readonly _form = this._fb.group({
    rover: this._fb.control('Curiosity'),
  });
  public readonly controls = this._form.controls;

  public readonly marsPhotos$ = this._nasaMarsPhotosService.marsPhotos$;
  public readonly manifests$ = this._nasaMarsPhotosService.manifests$;
  public readonly isLoaded$ =
    this._nasaMarsPhotosService.hasFetchedInitialData$;

  public readonly rovers = ROVERS;

  public openPhotoDialog(photoID: number): void {
    this._nasaMarsPhotosService.selectedPhotoID.set(photoID);
    this._matDialogService.open(PhotoDialogComponent);
  }
}
