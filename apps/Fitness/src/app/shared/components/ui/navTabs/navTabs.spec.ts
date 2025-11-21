import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavTabs } from './navTabs';

describe('NavTabs', () => {
  let component: NavTabs;
  let fixture: ComponentFixture<NavTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(NavTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
