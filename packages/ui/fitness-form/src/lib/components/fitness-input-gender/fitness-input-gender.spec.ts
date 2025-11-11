import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessInputGender } from './fitness-input-gender';

describe('FitnessInputGender', () => {
  let component: FitnessInputGender;
  let fixture: ComponentFixture<FitnessInputGender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitnessInputGender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitnessInputGender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
