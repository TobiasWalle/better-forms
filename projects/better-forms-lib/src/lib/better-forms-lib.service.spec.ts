import { TestBed, inject } from '@angular/core/testing';

import { BetterFormsLibService } from './better-forms-lib.service';

describe('BetterFormsLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BetterFormsLibService]
    });
  });

  it('should be created', inject([BetterFormsLibService], (service: BetterFormsLibService) => {
    expect(service).toBeTruthy();
  }));
});
