import { TestBed } from '@angular/core/testing';

import { Exercises } from './exercises';

describe('Exercises', () => {
  let service: Exercises;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Exercises);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
