import { TestBed } from '@angular/core/testing';

import { ConversationStorageService } from './conversation-storage.service';

describe('ConversationStorageService', () => {
  let service: ConversationStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
