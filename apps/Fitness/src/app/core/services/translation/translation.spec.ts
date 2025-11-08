import { TestBed } from '@angular/core/testing';

import { Translation } from './translation';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Translation', () => {
  let service: Translation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(Translation);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
