// Tipado de la variable servirá como registro en la tabla de dispositivos
export interface Registro {
  equipo: string;
  numeroSerie?: string;
  modelo: string;
  posicion?: number;
}

// Tipado de la variable que dará formato a los tooltips informativos
export interface ToolTipInfo {
  colorTexto: string;
  clase: string;
  texto: string;
}
