import { TestBed } from '@angular/core/testing';

import { AuthApiKpService } from './auth-api-kp.service';

describe('AuthApiKpService', () => {
  let service: AuthApiKpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthApiKpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
