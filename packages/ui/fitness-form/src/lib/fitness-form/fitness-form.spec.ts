import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FitnessForm } from './fitness-form';

describe('FitnessForm', () => {
  let component: FitnessForm;
  let fixture: ComponentFixture<FitnessForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitnessForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FitnessForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
