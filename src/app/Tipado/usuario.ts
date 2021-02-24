export interface Observacion {
  fechaObs: Date;
  motObs: string;
}

export interface Permiso {
  tipo: string;
  valor: boolean;
}

export interface RespuestaUsuario {
  Correcto: boolean;
  mensaje: string;
  usuarios: [Usuario];
}

export interface Usuario {
  usuario: string;
  apellidos: string;
  nombre: string;
  email: string;
  dni: string;
  cnp: number;
  codProg: number;
  puesto: [string];
  regimen: string;
  categoria: string;
  empresa: string;
  permisos: [Permiso];
  observaciones: [Observacion];
}
