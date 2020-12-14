export class Area {
  constructor(public nombre: string, public clave: string) {}
}

export class TipoArea {
  constructor(public nombre: string, public area: Area[]) {}
}
