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
    this.logger$.salidaPantalla(
      'INFO',
      'IncidenciasComponent',
      'Se ha creado el componente incidencias'
    );
  }

  ngOnInit(): void {

    this.logger$.salidaPantalla(
      'INFO',
      'IncidenciaComponent',
      'Iniciamos la Subscripcion a Incidencias'
    );

    this.incidenciaSubscripcion = this._incidenciaObservable$.incidenciaObservable$.subscribe(
      (respuesta: Incidencia) => {
        if (respuesta) {
          this.logger$.salidaPantalla(
            'SEG',
            'incidenciaComponent',
            `incidenciaSubscripcion -> ${JSON.stringify(respuesta)}`
          );
        }
      });

    this.incidencia = this.inicializaIncidencia();
    this.informacionRecibida(this.incidencia);
    // this.incidencia = null;
    // this.verCrearComponent = false;

    return;
  }

  informacionRecibida(incidencia: Incidencia) {
    this.logger$.salidaPantalla(
      'SEG',
      'IncidenciaComponent',
      `InformacionRecibida: Hemos recibido la incidencia: ${incidencia.numero}, con estado: ${incidencia.estado}`
    );

    this.incidencia = incidencia;
    this.verCrearComponent = true;

    this._incidenciaObservable$.gestionaIncidencia(incidencia);
  }

  inicializaIncidencia(): Incidencia {

    const temporal: Incidencia = {
      tipo: null,
      numero: null,
      fecha: [
        {
          tipo: 'Alta',
          valor: null,
        },
        {
          tipo: 'Cierre',
          valor: null,
        },
      ],
      codCentro: null,
      dispositivo: null,
      descripcion: {
        usuario: null,
        texto: null,
      },
      categoria: [
        {
          tipo: 'Inicial',
          valor: null,
        },
        {
          tipo: 'Final',
          valor: null,
        },
      ],
      diario: null,
      resolucion: {
        usuario: null,
        texto: null,
      },
      estado: null,
    };

    return temporal;
  }
}
