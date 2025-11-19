import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessFormRadio } from './fitness-form-radio';

describe('FitnessFormRadio', () => {
  let component: FitnessFormRadio;
  let fixture: ComponentFixture<FitnessFormRadio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitnessFormRadio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitnessFormRadio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
