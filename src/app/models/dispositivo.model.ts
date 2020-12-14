export class Categoria {
  constructor(public nombre: string, public prefijo: string) {}
}

export class Fabricante {
  constructor(public fabricante: string) {}
}

export class Modelo {
  constructor(
    public fabricante: string,
    public modelo: string,
    public nombre: string,
    public categoria: string,
    public codDispositivo: string
  ) {}
}
