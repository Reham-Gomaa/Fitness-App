import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhyUs } from './why-us';

describe('WhyUs', () => {
  let component: WhyUs;
  let fixture: ComponentFixture<WhyUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyUs],
    }).compileComponents();

    fixture = TestBed.createComponent(WhyUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
