// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// ************************************************************************************************
// *********************************** Tipado *****************************************************
// ************************************************************************************************
import { Incidencia } from './../../Tipado/Incidencias';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './../../services/logger.service';
import { IncidenciaComService } from './../../services/comunicacion/incidencia-com.service';
import { IncidenciaObservableService } from './../../services/incidencia-observable.service';

@Component({
  selector: 'app-incidencia',
  templateUrl: './incidencia.component.html',
  styleUrls: ['./incidencia.component.css'],
})


export class IncidenciaComponent implements OnInit {

  incidenciaSubscripcion: Subscription;


  incidencia: Incidencia;
  // Variable que controla la visualización del componente crear.
  verCrearComponent: boolean;

  constructor(private logger$: LoggerService,
              private _incidenciaObservable$: IncidenciaObservableService) {
    this.logger$.enviarMensajeConsola(
      'IncidenciasComponent',
      'Se ha creado el componente incidencias'
    );
  }

  ngOnInit(): void {

    this.logger$.enviarMensajeConsola(
      'IncidenciaComponent',
      'Iniciamos la Subscripcion a Incidencias'
    );
    this.incidenciaSubscripcion = this._incidenciaObservable$.incidenciaObservable$.subscribe(
      (respuesta: Incidencia) => {
        if (respuesta) {
          this.logger$.enviarMensajeConsola(
            'incidenciaComponent',
            `incidenciaSubscripcion -> ${JSON.stringify(respuesta)}`
          );
        }
      });

    this.incidencia = null;
    this.verCrearComponent = false;
  }

  informacionRecibida(incidencia: Incidencia) {
    this.logger$.enviarMensajeConsola(
      'IncidenciasComponent',
      `Hemos recibido la incidencia: ${incidencia.numero}, con estado: ${incidencia.estado}`
    );

    this.incidencia = incidencia;
    this.verCrearComponent = true;

    this._incidenciaObservable$.gestionaIncidencia(incidencia);
  }
}
