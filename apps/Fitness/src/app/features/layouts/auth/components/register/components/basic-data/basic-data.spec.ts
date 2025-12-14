import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicData } from './basic-data';

describe('BasicData', () => {
  let component: BasicData;
  let fixture: ComponentFixture<BasicData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
