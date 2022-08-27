import { TestBed } from '@angular/core/testing';

import { LyriqsService } from './lyriqs.service';

describe('LyriqsService', () => {
  let service: LyriqsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LyriqsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
