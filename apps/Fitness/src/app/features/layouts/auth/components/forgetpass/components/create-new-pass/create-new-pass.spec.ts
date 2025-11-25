import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPass } from './create-new-pass';

describe('CreateNewPass', () => {
  let component: CreateNewPass;
  let fixture: ComponentFixture<CreateNewPass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewPass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewPass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
