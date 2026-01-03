import { TestBed } from '@angular/core/testing';

import { GeminiIntegration } from './gemini-integration';

describe('GeminiIntegration', () => {
  let service: GeminiIntegration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminiIntegration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
