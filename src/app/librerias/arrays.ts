import { Registro } from './../Tipado/entorno';

/******************************************************************
 ** Función que transforma la fecha de formato dd/mm/yyyy  a ISO **
 ******************************************************************/
export function fechaToISO(fecha: string): Date {
  let dia: string;
  let mes: string;
  let ano: string;
  let fechaIso: Date;
  dia = fecha.substring(0, fecha.indexOf('/'));
  fecha = fecha.slice(fecha.indexOf('/') + 1, fecha.length);
  mes = fecha.substring(0, fecha.indexOf('/'));
  ano = fecha.substring(fecha.length - 4, fecha.length);
  fechaIso = new Date(`${ano}-${mes}-${dia}`);
  return fechaIso;
}

/************************************************************************
 ** Función que recupera los elementos únicos de un array de Registros **
 ************************************************************************/

function soloUnicos(valor: string, indice: number, self: string[]): boolean {
    return self.indexOf(valor) === indice;
  }

export function  recuperaSoloUnicos(listaDispositivos: Registro[]): string[] {
    this.logger$.salidaPantalla(
      'INFO',
      'categorizacionService',
      `recuperaSoloUnicos -> ${JSON.stringify(listaDispositivos)}`
    );

    const dispositivos = [];

    listaDispositivos.forEach((elemento) => {
      dispositivos.push(elemento.modelo);
    });

    this.logger$.salidaPantalla(
      'INFO',
      'Librería Arrays',
      `recuperaSoloUnicos -> DispositivosUnicos : ${dispositivos}`
    );

    return dispositivos;
  }
