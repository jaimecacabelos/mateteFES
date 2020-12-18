export interface Categoria {
  tipo: string;
  valor: string;
}

export interface Diario {
  fecha: Date;
  usuario: string;
  nota: string;
  tarea: string;
}

export interface Dispositivo {
  equipo: string;
  numeroSerie?: string;
  modelo: string;
}

export interface Fecha {
  tipo: string;
  valor: Date;
}

export interface Resolucion {
  usuario: string;
  texto: string;
}

export interface Incidencia {
  tipo: string;
  numero: number;
  fecha: Fecha[];
  codCentro: string;
  dispositivo: Dispositivo[];
  descripcion: string;
  categoria: Categoria[];
  diario: Diario[];
  resolucion: Resolucion;
  estado: string;
}

/* Hace falta?

export class Categorizacion {
  constructor(
    public codigo: string,
    public categoria: string,
    public aplica: string[],
    public nombre: string
  ) {}
}

*/
