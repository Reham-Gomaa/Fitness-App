import { TestBed } from '@angular/core/testing';

import { Muscles } from './muscles';

describe('Muscles', () => {
  let service: Muscles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Muscles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
