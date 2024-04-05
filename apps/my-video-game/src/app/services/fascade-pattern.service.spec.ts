import { TestBed } from '@angular/core/testing';

import { FascadePatternService } from './fascade-pattern.service';

describe('FascadePatternService', () => {
  let service: FascadePatternService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FascadePatternService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
