import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGender } from './select-gender';

describe('SelectGender', () => {
  let component: SelectGender;
  let fixture: ComponentFixture<SelectGender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectGender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectGender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
