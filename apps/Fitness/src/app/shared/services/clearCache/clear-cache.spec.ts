import { TestBed } from '@angular/core/testing';

import { ClearCache } from './clear-cache';

describe('ClearCache', () => {
  let service: ClearCache;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClearCache);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
