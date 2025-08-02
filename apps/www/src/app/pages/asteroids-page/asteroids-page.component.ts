import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NeowsStoreService } from '../../services/nasa/neows-store.service';
import { SpaceGraphComponent } from './space-graph/space-graph.component';

@Component({
  selector: 'nd-asteroids-page',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatInputModule,
    MatDatepickerModule,
    MatMenuModule,
    MatButtonModule,
    SpaceGraphComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './asteroids-page.component.html',
  styleUrl: './asteroids-page.component.scss',
})
export class AsteroidsPageComponent implements OnInit {
  private readonly _asteroidsStoreService = inject(NeowsStoreService);

  public readonly asteroids = this._asteroidsStoreService.asteroids;
  public readonly paginationInfo$ = this._asteroidsStoreService.paginationInfo$;
  public readonly hasFetchedInitialData$ =
    this._asteroidsStoreService.hasFetchedInitialData$;

  public readonly selectedAsteroidID =
    this._asteroidsStoreService.selectedAsteroidID;

  public async ngOnInit(): Promise<void> {
    if (this.asteroids().length === 0) return;
    const [asteroid] = this.asteroids();
    const helioccenctricCordinates = await this._asteroidsStoreService.calculateOrbit(
      asteroid.id
    );
    console.log(helioccenctricCordinates);
  }
}
