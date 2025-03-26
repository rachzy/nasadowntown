import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotosMosaicComponent } from './photos-mosaic.component';

describe('PhotosMosaicComponent', () => {
  let component: PhotosMosaicComponent;
  let fixture: ComponentFixture<PhotosMosaicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosMosaicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosMosaicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
