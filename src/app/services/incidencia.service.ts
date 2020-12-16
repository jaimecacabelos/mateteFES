// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

// ************************************************************************************************
// *********************************** Tipado *****************************************************
// ************************************************************************************************
import { Incidencia } from './../Tipado/Incidencias';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './logger.service';
import { URL_SERVICIOS } from '../config/config';

// ************************************************************************************************
// *********************************** Variables Globales *****************************************
// ************************************************************************************************

interface Respuesta {
  correcto: boolean;
  cuenta: number;
  mensaje: string;
  incidencias: Incidencia[];
}

@Injectable({
  providedIn: 'root',
})
export class IncidenciaService {
  constructor(public http: HttpClient, private logger$: LoggerService) {}

  respuesta: Respuesta;

  buscarIncidencia(incidencia: Incidencia) {
    this.logger$.enviarMensajeConsola('_incidenciaService', 'buscarIncidencia');
    // Aplicamos un template para la construcción de la url
    const url = `${URL_SERVICIOS}/incidencia/${incidencia.tipo}/${incidencia.numero}`;

    this.logger$.enviarMensajeConsola(
      '_incidenciaService',
      `Cadena de búsqueda: ${url}`
    );
    return this.http.get<Respuesta>(url).pipe(
      map ( respuesta => {
        return respuesta.incidencias;
      })
    );
  }

  recuperaCategorizacion(tipo: string, dispositivo: string) {
    this.logger$.enviarMensajeConsola(
      '_incidenciaService',
      `recuperaCategorización (${tipo}, ${dispositivo})`
    );

    const url = `${URL_SERVICIOS}/categorizacion`;
    let params = new HttpParams();
    params = params.set('tipo', tipo);
    params = params.set('dispositivo', dispositivo);

    return this.http.get(url, { params });
  }
}
