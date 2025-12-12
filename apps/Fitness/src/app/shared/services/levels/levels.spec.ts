import { TestBed } from '@angular/core/testing';

import { Levels } from './levels';

describe('Levels', () => {
  let service: Levels;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Levels);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
