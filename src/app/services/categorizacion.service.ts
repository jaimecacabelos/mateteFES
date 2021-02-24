// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './logger.service';
import { DispositivoService } from './dispositivo.service';

// ************************************************************************************************
// *********************************** Tipado *****************************************************
// ************************************************************************************************
import { Registro } from './../Tipado/entorno';

// ************************************************************************************************
// ********************************** Variables Globales ******************************************
// ************************************************************************************************
import { URL_SERVICIOS } from './../config/config';


@Injectable({
  providedIn: 'root',
})
export class CategorizacionService {
  ruta = `${URL_SERVICIOS}/categorizacion`;

  constructor(public http: HttpClient,
              private dispositivo$: DispositivoService,
              private logger$: LoggerService) {}

  buscarCategoriaCodigo(codigoIn: string) {
    const url = `${this.ruta}/cod?val=${codigoIn}`;

    this.logger$.salidaPantalla(
      'INFO',
      'CategorizacionService',
      `buscarCategoriaCodigo(${codigoIn}) -> url: ${url}`
    );

    return this.http
      .get(url)
      .pipe(map((respuesta: any) => respuesta.categorias));
  }

  //  buscarCategoriaTexto(tipo: boolean, textoIn: string, dispositivoIn: string) {
  buscarCategoriaTexto(
    tipo: string,
    textoIn: string,
    dispositivoIn: Registro[]
  ) {

  //  const url = `${this.ruta}/texto?tipo=${tipo}&dispositivo=${dispositivoIn}&val=${textoIn}`;
      let url = '';

      url = `${this.ruta}/texto?tipo=${tipo}&dispositivo=${this.recuperaModelos(dispositivoIn)}&texto=${textoIn}`;

      return this.http
          .get(url)
          .pipe(map((respuesta: any) => respuesta.categorias));

    }

    recuperaModelos(dispositivos: Registro[]){
      this.logger$.salidaPantalla(
        'INFO',
        'CategorizacionService',
        `recuperaModelos: Dispositivos -> ${JSON.stringify(dispositivos)}`
      );

      const modelos: string[] = [];

      dispositivos.forEach(elemento => {
        modelos.push(elemento.modelo);
      });

      return modelos;

    }
}
