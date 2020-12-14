// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './logger.service';

// ************************************************************************************************
// ********************************** Variables Globales ******************************************
// ************************************************************************************************
import { URL_SERVICIOS } from './../config/config';

@Injectable({
  providedIn: 'root',
})
export class CentroService {
  ruta = `${URL_SERVICIOS}/centro`;

  constructor(public http: HttpClient, private logger$: LoggerService) {}

  buscarCentroNombre(tipo: string, area: string, nombre: string) {
    let url = '';

    if (area.length > 0) {
      this.logger$.enviarMensajeConsola('BuscarCentroDialog', 'Tenemos area');
      url = `${this.ruta}/${tipo}/${area}/${nombre}`;
    } else {
      url = `${this.ruta}/${tipo}/${nombre}`;
    }
    this.logger$.enviarMensajeConsola(
      'centroService',
      `buscarCentroNombre URL: ${url}`
    );

    return this.http.get(url);
  }

  verificaClave(codCentro: string) {
    let url = '';
    this.logger$.enviarMensajeConsola(
      'centroService',
      `verificaClave(${codCentro})`
    );
    url = `${this.ruta}/${codCentro}`;
    return this.http.get(url);
  }
}
