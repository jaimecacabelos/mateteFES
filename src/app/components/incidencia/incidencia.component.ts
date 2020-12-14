// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// ************************************************************************************************
// *********************************** Modelos ****************************************************
// ************************************************************************************************
import { Incidencia } from './../../models/incidencia.model';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './../../services/logger.service';
import { IncidenciaComService } from './../../services/comunicacion/incidencia-com.service';

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
              private incidenciaCom$: IncidenciaComService) {
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
    this.incidenciaSubscripcion = this.incidenciaCom$.incidenciaObservable$.subscribe((res) => {
        if (res) {
          this.logger$.enviarMensajeConsola(
            'incidenciaComponent',
            `incidenciaSubscripcion -> ${JSON.stringify(res)}`
          );
          // perform your other action from here

        }
      });

    this.verCrearComponent = false;
    this.incidencia = null;
  }

  informacionRecibida(incidencia: Incidencia) {
    this.logger$.enviarMensajeConsola(
      'IncidenciasComponent',
      `Hemos recibido la incidencia: ${incidencia.numero}, con estado: ${incidencia.estado}`
    );

    this.incidencia = incidencia;
    this.verCrearComponent = true;

    this.incidenciaCom$.notificaIncidencia(incidencia);
  }
}
