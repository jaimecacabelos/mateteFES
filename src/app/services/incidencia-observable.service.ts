// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// ************************************************************************************************
// *********************************** Tipado *****************************************************
// ************************************************************************************************
import { Incidencia } from './../Tipado/Incidencias';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})

export class IncidenciaObservableService {
  private incidenciaSubject = new Subject<Incidencia>();

  incidenciaObservable$ = this.incidenciaSubject.asObservable();

  constructor(private logger$: LoggerService) {}

  public notificaIncidencia(incidencia: Incidencia) {
    if (incidencia) {
      this.logger$.enviarMensajeConsola(
        'incidenciaObservableService',
        `Se ha recibido incidencia -> ${JSON.stringify(incidencia)}`
      );
      this.incidenciaSubject.next(incidencia);
    }
  }
}
