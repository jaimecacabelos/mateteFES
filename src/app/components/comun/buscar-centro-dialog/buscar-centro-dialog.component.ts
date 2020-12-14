// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

// ************************************************************************************************
// *********************************** Modelos ****************************************************
// ************************************************************************************************
import { CentroCorto } from './../../../models/centro.model';
import { Area } from './../../../models/area.model';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './../../../services/logger.service';
import { CentroService } from './../../../services/centro.service';

// ************************************************************************************************
// *********************************** Datos ******************************************************
// ************************************************************************************************
import { recuperaAreas } from 'src/app/config/sanidad';

@Component({
  selector: 'app-buscar-centro-dialog',
  templateUrl: './buscar-centro-dialog.component.html',
  styleUrls: ['./buscar-centro-dialog.component.css'],
})
export class BuscarCentroDialogComponent implements OnInit {
  buscarCentroForm: FormGroup;
  tipoCentro = new FormControl('', Validators.required);
  areaCentro = new FormControl('', Validators.required);
  nombreCentro = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  codCentro: string;
  tipoCentroBoton: string;

  areas: Area[];
  centros: CentroCorto[];
  sinCentros: boolean;

  constructor(
    private centro$: CentroService,
    private logger$: LoggerService,
    private fb: FormBuilder,
    private buscarCentroDialogRef: MatDialogRef<BuscarCentroDialogComponent>
  ) {
    this.iniciaFormulario();
  }

  ngOnInit(): void {
    this.buscarCentroForm.get('tipoCentro').setValue('SGS');
    // Forzamos una primera carga de areaSelect
    this.cambiarTipo();
    this.logger$.enviarMensajeConsola(
      'BuscarCentroDialog',
      `Valor TipoCentroBoton: ${this.tipoCentroBoton}`
    );
    this.sinCentros = true;
  }

  iniciaFormulario() {
    this.buscarCentroForm = this.fb.group({
      tipoCentro: this.tipoCentro,
      areaCentro: this.areaCentro,
      nombreCentro: this.nombreCentro,
    });
  }

  cambiarTipo() {
    this.tipoCentroBoton = this.buscarCentroForm.get('tipoCentro').value;
    this.poblarAreaSelect(this.buscarCentroForm.get('tipoCentro').value);
  }

  poblarAreaSelect(tipo: string) {
    this.logger$.enviarMensajeConsola(
      'BuscarCentroDialog',
      `Vamos a poblar con tipo ${tipo}`
    );
    if (tipo === 'SGS') {
      this.areas = recuperaAreas('SGS');
    } else {
      this.areas = recuperaAreas('SPC');
    }
  }

  filtraTecla(valor: string) {
    // Evitamos las flechas y Enter ya que interaccionan con el list del Autocomplete
    if (valor === 'ArrowUp' || valor === 'ArrowDown' || valor === 'Enter') {
      return;
    } else {
      this.logger$.enviarMensajeConsola(
        'BuscarCentroDialog',
        `buscarCentro -> Valor enviado: ${valor}`
      );
    }
    this.buscarCentro();
  }

  buscarCentro() {
    this.logger$.enviarMensajeConsola(
      'BuscarCentroDialog',
      'Nos encontramos en buscarCentro()'
    );
    // Eliminamos los espacios al principio y al final con trim().
    const centro: string = this.buscarCentroForm
      .get('nombreCentro')
      .value.trim();
    // La cuenta empieza tras el primer caracter que no sea un espacio.
    if (centro.length < 3) {
      // Vaciamos centros ya que, si borramos el input nos aparecerían
      // los centros anteriores hasta que se vuelve a lanzar la consulta.
      this.centros = [];
      return;
    }
    this.sinCentros = true;
    this.logger$.enviarMensajeConsola(
      'BuscarCentroDialog',
      `Longitud del nombre mayor a 3: ${centro}`
    );
    this.centro$
      .buscarCentroNombre(
        this.buscarCentroForm.get('tipoCentro').value,
        this.buscarCentroForm.get('areaCentro').value,
        this.buscarCentroForm.get('nombreCentro').value
      )
      .subscribe((respuesta: any) => {
        this.logger$.enviarMensajeConsola(
          'BuscarCentroDialog',
          `Tamaño de la respuesta: ${respuesta.centros.length}`
        );
        if (respuesta.centros.length === 0) {
          this.sinCentros = false;
        }
        this.centros = respuesta.centros;
      });
  }

  // Función para construir la respuesta a mostrar en el Select
  muestraCentro(centro: CentroCorto) {
    return centro.nombreCentro;
  }
  // Recibimos el codCentro
  finalizar(centro: string) {
    this.areas.forEach((area) => {
      if (area.clave === centro.charAt(0)) {
        this.logger$.enviarMensajeConsola(
          'BuscarCentroDialog',
          `Areas Coinciden: ${area.clave}`
        );
        this.buscarCentroForm.get('areaCentro').setValue(area.clave);
      }
    });
    this.buscarCentroDialogRef.close(centro);
  }
}
