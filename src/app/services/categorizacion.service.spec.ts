import { TestBed } from '@angular/core/testing';

import { CategorizacionService } from './categorizacion.service';

describe('CategorizacionService', () => {
  let service: CategorizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
