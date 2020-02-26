import { TestBed, inject } from '@angular/core/testing';

import { HttpDatasourceService } from './http-datasource.service';

describe('HttpDatasourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpDatasourceService]
    });
  });

  it('should be created', inject([HttpDatasourceService], (service: HttpDatasourceService) => {
    expect(service).toBeTruthy();
  }));
});
