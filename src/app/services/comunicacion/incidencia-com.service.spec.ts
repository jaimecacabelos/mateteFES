import { TestBed } from '@angular/core/testing';

import { IncidenciaComService } from './incidencia-com.service';

describe('IncidenciaComService', () => {
  let service: IncidenciaComService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidenciaComService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
