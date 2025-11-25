import { TestBed } from '@angular/core/testing';

import { PlatFormService } from './platform';

describe('Platform', () => {
  let service: PlatFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if the platform is browser', () => {
    expect(service.isBrowser()).toBe(true);
  });
});
