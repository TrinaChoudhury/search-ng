import { TestBed, inject } from '@angular/core/testing';

import { StateMgmtService } from './state-mgmt.service';

describe('StateMgmtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateMgmtService]
    });
  });

  it('should be created', inject([StateMgmtService], (service: StateMgmtService) => {
    expect(service).toBeTruthy();
  }));
});
