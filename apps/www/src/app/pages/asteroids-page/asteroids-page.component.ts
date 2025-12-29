import { Component, computed, inject, OnInit } from '@angular/core';
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
import { CelestialBody } from '@libs/shared/lib/types/celestial-body';
import { getGregorianDateInStandardFormat } from '@libs/shared/lib/utils/astrophysics/julian';

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
  public readonly orbitCalculations =
    this._asteroidsStoreService.orbitCalculationsByAsteroid;
  public readonly paginationInfo$ = this._asteroidsStoreService.paginationInfo$;
  public readonly hasFetchedInitialData$ =
    this._asteroidsStoreService.hasFetchedInitialData$;

  public readonly selectedAsteroidID =
    this._asteroidsStoreService.selectedAsteroidID;

  public readonly asteroidsAsCelestialBodies = computed<CelestialBody[]>(() =>
    this.asteroids()
      .filter((asteroid) => {
        const currentDate = getGregorianDateInStandardFormat(new Date());
        const asteroidCalculatedOrbits =
          this.orbitCalculations()?.[asteroid.id];
        return Boolean(
          asteroidCalculatedOrbits &&
            Object.hasOwn(asteroidCalculatedOrbits, currentDate)
        );
      })
      .map((asteroid) => {
        const orbits = this.orbitCalculations()[asteroid.id];
        const currentDate = getGregorianDateInStandardFormat(new Date());
        const orbit = orbits[currentDate];
        return {
          ...asteroid,
          type: 'asteroid',
          position: {
            x: orbit.heliocentricCoordinates.x,
            y: orbit.heliocentricCoordinates.y,
          },
          radius: 1,
          color: '#000',
        };
      })
  );

  public async ngOnInit(): Promise<void> {
    if (this.asteroids().length === 0) return;
    const [asteroid] = this.asteroids();
    const helioccenctricCordinates =
      await this._asteroidsStoreService.calculateOrbit(asteroid.id);
    console.log(helioccenctricCordinates);
  }
}
