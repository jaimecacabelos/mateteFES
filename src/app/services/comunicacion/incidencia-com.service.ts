import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Incidencia } from './../../models/incidencia.model';

import { LoggerService } from './../logger.service';

@Injectable({
  providedIn: 'root',
})

export class IncidenciaComService {
  private incidenciaSubject = new Subject<Incidencia>();

  incidenciaObservable$ = this.incidenciaSubject.asObservable();

  constructor(private logger$: LoggerService) {}

  public notificaIncidencia(incidencia: Incidencia) {
    if (incidencia) {
      this.logger$.enviarMensajeConsola(
        'incidenciaComService',
        `Se ha recibido incidencia -> ${JSON.stringify(incidencia)}`
      );
      this.incidenciaSubject.next(incidencia);
    }
  }
}
