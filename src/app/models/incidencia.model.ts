
export class Incidencia {
  constructor(
    public tipo: string,
    public numero: number,
    public fecha: [{
      tipo: string,
      valor: Date
    }],
    public codCentro: string,
    public dispositivo: [{
      equipo: string,
      numeroSerie?: string,
      modelo: string
    }],
    public descripcion: string,
    public categoria: [{
      tipo: string,
      valor: string
    }],
    public diario: [{
      fecha: Date,
      usuario: string,
      nota: string,
      tareas: string
    }],
    public resolucion: {
      usuario: string,
      texto: string
    },
    public estado: string
  ) {}
}

export class Categorizacion {
  constructor(
    public codigo: string,
    public categoria: string,
    public aplica: string[],
    public nombre: string
  ) {}
}
