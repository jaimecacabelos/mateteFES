  /******************************************************************
   ** Función que transforma la fecha de formato dd/mm/yyyy  a ISO **
   ******************************************************************/
  export function fechaToISO(fecha: string): Date {
    let dia: string;
    let mes: string;
    let ano: string;
    let fechaIso: Date;
    dia  = fecha.substring(0, fecha.indexOf('/'));
    fecha = fecha.slice(fecha.indexOf('/') + 1, fecha.length);
    mes = fecha.substring(0, fecha.indexOf('/'));
    ano = fecha.substring(fecha.length - 4, fecha.length);
    fechaIso = new Date (`${ano}-${mes}-${dia}`);
    return fechaIso;
  }

  /******************************************************************
   ** Función que transforma la fecha en ISO al formato dd/mm/yyyy **
   ******************************************************************/
  export function fechaToString(fechaISO: Date): string {
    const fecha = `${fechaISO.getDate()}/${fechaISO.getMonth() + 1 }/${fechaISO.getFullYear()}`;
    return fecha;
  }
