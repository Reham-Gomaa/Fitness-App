import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessInputSlider } from './fitness-input-slider';

describe('FitnessInputSlider', () => {
  let component: FitnessInputSlider;
  let fixture: ComponentFixture<FitnessInputSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitnessInputSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitnessInputSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
