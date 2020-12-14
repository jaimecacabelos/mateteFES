export class CentroCorto {
  constructor(
    public areaCentro: string,
    public nombreCentro: string,
    public codCentro: string
  ) {}
}

// Pendiente de revisión
export class Centro {
  constructor(
    public corto: string,
    public largo: string,
    public codCentro: string,
    public nombre: string
  ) {}
}
