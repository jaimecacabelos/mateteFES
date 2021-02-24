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
      this.logger$.enviarMensajeConsola('centroService', 'Tenemos area');
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
    // Para verificar la clave no hace falta que nos devuelvan toda la información del centro
    // const url = `${this.ruta}?codCentro=${codCentro}`;

    const url = `${this.ruta}/cabecera?codCentro=${codCentro}`;

    this.logger$.salidaPantalla(
      'SEG',
      'centroService',
      `Estamos en verificaClave -> url : ${url}`
    );

    return this.http.get(url);
  }
}
