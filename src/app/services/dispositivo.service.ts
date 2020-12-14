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
// *********************************** Variables Globales *****************************************
// ************************************************************************************************
import { URL_SERVICIOS } from './../config/config';

@Injectable({
  providedIn: 'root',
})
export class DispositivoService {
  constructor(public http: HttpClient, private logger$: LoggerService) {}

  verificaClave(clave: string) {
    this.logger$.enviarMensajeConsola(
      'dispositivoService',
      `Estamos en verificaClave: ${clave}`
    );

    const url = `${URL_SERVICIOS}/dispositivo/modelo/${clave}`;

    this.logger$.enviarMensajeConsola(
      'dispositivoService',
      `verificaClave -> Cadena de búsqueda: ${url}`
    );

    return this.http.get(url);
  }

  recuperaCategorias(electromedicina: boolean) {
    this.logger$.enviarMensajeConsola(
      'dispositivoService',
      `Estamos en recuperaCategorias: ${electromedicina}`
    );

    const url = `${URL_SERVICIOS}/dispositivo/maestro/${electromedicina}`;

    this.logger$.enviarMensajeConsola(
      'dispositivoService',
      `recuperaCategorias -> Cadena de búsqueda: ${url}`
    );

    return this.http.get(url);
  }

  recuperaFabricantes(categoria: string) {
    this.logger$.enviarMensajeConsola(
      'dispositivoService',
      `Estamos en recuperaFabricantes -> Categoria: ${categoria}`
    );

    const url = `${URL_SERVICIOS}/dispositivo/${categoria}`;

    this.logger$.enviarMensajeConsola(
      'dispositivoService',
      `recuperaFabricantes -> Cadena de búsqueda: ${url}`
    );

    return this.http.get(url);
  }

  recuperaModelos(dispositivo: string, fabricante: string) {
    this.logger$.enviarMensajeConsola(
      'dispositivoService',
      `Estamos en recuperaModelos -> dispositivo: ${dispositivo}, fabricante: ${fabricante}`
    );

    const url = `${URL_SERVICIOS}/dispositivo/${dispositivo}/${fabricante}`;

    this.logger$.enviarMensajeConsola(
      'dispositivoService',
      `recuperaModelos -> Cadena de búsqueda: ${url}`
    );

    return this.http.get(url);
  }
}
