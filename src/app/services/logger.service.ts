import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor() {}

  enviarMensajeConsola(componente: string, mensaje: string) {
    console.log(`${componente} - ${mensaje}`);
  }
}
