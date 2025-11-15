import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Workouts } from './workouts';

describe('Workouts', () => {
  let component: Workouts;
  let fixture: ComponentFixture<Workouts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Workouts],
    }).compileComponents();

    fixture = TestBed.createComponent(Workouts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
