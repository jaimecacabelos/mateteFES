import { TestBed } from '@angular/core/testing';

import { IncidenciaObservableService } from './incidencia-observable.service';

describe('IncidenciaObservableService', () => {
  let service: IncidenciaObservableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidenciaObservableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
