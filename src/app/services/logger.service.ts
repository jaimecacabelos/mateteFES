import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor() {}

  enviarMensajeConsola(componente: string, mensaje: string) {
    console.log(`${componente} - ${mensaje}`);
  }

  salidaPantalla(modo: string, componente: string, mensaje: string) {
    if (modo === 'ERR') {
      console.log(
        `%cERROR - ${componente} =>  %c${mensaje}`,
        'font-weight: bold; color: red',
        'color: red'
      );
      return;
    }

    if (modo === 'INFO') {
      console.log(
        `%cINFO - ${componente} =>  %c${mensaje}`,
        'font-weight: bold; color: blue',
        'color: blue'
      );
      return;
    }

    if (modo === 'SEG') {
      console.log(
        `%cSEGUIMIENTO - ${componente} =>  %c${mensaje}`,
        'font-weight: bold; color: green',
        'color: green'
      );
      return;
    }
  }
}
