// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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
export class UsuarioService {
  ruta = `${URL_SERVICIOS}/centro`;

  constructor(public http: HttpClient, private logger$: LoggerService) {}

  obtenerPrincipal() {
    const url = `${URL_SERVICIOS}/usuario/puestos/principal`;

    return this.http.get(url);
  }

  obtenerGrupos(principal: string) {
    const url = `${URL_SERVICIOS}/usuario/puestos`;
    const params = new HttpParams().append('principal', principal);

    return this.http.get(url, { params });
  }

  obtenerUsuarios(
    codUsuario?: string,
    codGrupo?: string,
    apellidos?: string,
    nombre?: string
  ) {
    const url = `${URL_SERVICIOS}/usuario`;

    let params = new HttpParams();

    if (codUsuario) {
      params = params.append('codUsuario', codUsuario);
    }

    if (codGrupo) {
      params = params.append('codGrupo', codGrupo);
    }

    if (apellidos) {
      params = params.append('apellidos', apellidos);
    }

    if (nombre) {
      params = params.append('nombre', nombre);
    }
    this.logger$.salidaPantalla(
      'INFO',
      'usuarioService',
      `obtenerUsuarios () -> url: ${url}, parámetros: ${params}`
    );

    return this.http.get(url, { params });
  }
}
