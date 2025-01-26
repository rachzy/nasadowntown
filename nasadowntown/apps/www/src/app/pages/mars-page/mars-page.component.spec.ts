import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarsPageComponent } from './mars-page.component';

describe('IndexPageComponent', () => {
  let component: MarsPageComponent;
  let fixture: ComponentFixture<MarsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
