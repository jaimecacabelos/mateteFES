import { Area } from './../models/area.model';

const areasSGS: Area[] = [
  {
    nombre: 'Area Sanitaria da Coruña e Cee',
    clave: 'C',
  },
  {
    nombre: 'Área Sanitaria de Ferrol',
    clave: 'F',
  },
  {
    nombre: 'Área Sanitaria de Lugo, A Mariña y Monforte de Lemos',
    clave: 'L',
  },
  {
    nombre: 'Área Sanitaria de Orense, Verín e O Barco de Valdeorras',
    clave: 'O',
  },
  {
    nombre: 'Área Sanitaria de Pontevedra e O Salnés',
    clave: 'P',
  },
  {
    nombre: 'Área Sanitaria de Santiago e Barbanza',
    clave: 'S',
  },
  {
    nombre: 'Area Sanitaria de Vigo',
    clave: 'V',
  },
];

const areasSPC: Area[] = [
  {
    nombre: 'Comarca Veterinaria',
    clave: 'X',
  },
  {
    nombre: 'Zona Veterinaria',
    clave: 'X',
  },
  {
    nombre: 'Inspección Farmacéutica',
    clave: 'X',
  },
  {
    nombre: 'Lonja',
    clave: 'X',
  },
  {
    nombre: 'Matadero',
    clave: 'X',
  },
];

export function recuperaAreas(tipo: string): Area[] {
  if (tipo === 'SGS') {
    return areasSGS;
  } else {
    return areasSPC;
  }
}
