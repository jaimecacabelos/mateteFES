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
import {
  Categoria,
  Fabricante,
  Modelo,
} from './../../../models/dispositivo.model';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './../../../services/logger.service';
import { DispositivoService } from './../../../services/dispositivo.service';

// ************************************************************************************************
// ********************************** Variables Globales ******************************************
// ************************************************************************************************
import { CELDAS } from './../../../config/entorno';

@Component({
  selector: 'app-buscar-modelo-dialog',
  templateUrl: './buscar-modelo-dialog.component.html',
  styleUrls: ['./buscar-modelo-dialog.component.css'],
})
export class BuscarModeloDialogComponent implements OnInit {
  buscarModeloForm: FormGroup;
  electromedicina = new FormControl('', Validators.required);
  categoria = new FormControl('', Validators.required);
  fabricante = new FormControl('', Validators.required);
  modelo = new FormControl('', Validators.required);

  estiloCelda: string;
  categoriasMaestro: Categoria[];
  fabricantesMaestro: Fabricante[];
  modelosMaestro: Modelo[];
  modeloSeleccionado: Modelo;

  constructor(
    private dispositivo$: DispositivoService,
    private logger$: LoggerService,
    private fb: FormBuilder,
    private buscarModeloDialogRef: MatDialogRef<BuscarModeloDialogComponent>
  ) {
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.estiloCelda = CELDAS;
    this.buscarModeloForm.get('electromedicina').setValue(false);

    this.logger$.enviarMensajeConsola(
      'buscarModeloDialog',
      `Valor del check en el constructor -> ${
        this.buscarModeloForm.get('electromedicina').value
      }`
    );
    this.poblarMaestroCategorias(
      this.buscarModeloForm.get('electromedicina').value
    );
    this.fabricantesMaestro = null;
    this.modelosMaestro = null;
    this.modeloSeleccionado = null;
  }

  construirFormulario() {
    this.buscarModeloForm = this.fb.group({
      electromedicina: this.electromedicina,
      categoria: this.categoria,
      fabricante: this.fabricante,
      modelo: this.modelo,
    });
  }

  poblarMaestroCategorias(electromedicina: boolean) {
    this.logger$.enviarMensajeConsola(
      'buscarModeloDialog',
      `poblarMaestro -> electromedicina: ${electromedicina}`
    );
    this.categoriasMaestro = null;

    this.dispositivo$
      .recuperaCategorias(electromedicina)
      .subscribe((respuesta: any) => {
        if (!respuesta.categorias) {
          this.logger$.enviarMensajeConsola(
            'buscarModeloDialog',
            'Se ha producido un error recuperando las categorías'
          );
        } else {
          this.categoriasMaestro = respuesta.categorias;
        }
      });
  }

  cambioElectromedicina() {
    this.logger$.enviarMensajeConsola(
      'buscarModeloDialog',
      `cambioElectromedicina() -> ${
        this.buscarModeloForm.get('electromedicina').value
      }`
    );
    this.poblarMaestroCategorias(
      this.buscarModeloForm.get('electromedicina').value
    );
    this.fabricantesMaestro = null;
    this.modelosMaestro = null;
  }

  poblarFabricantes(dispositivo: string) {
    this.logger$.enviarMensajeConsola(
      'buscarModeloDialog',
      `poblarFabricantes -> Dispositivo: ${dispositivo}`
    );

    this.dispositivo$
      .recuperaFabricantes(dispositivo)
      .subscribe((respuesta: any) => {
        if (!respuesta.fabricantes) {
          this.logger$.enviarMensajeConsola(
            'buscarModeloDialog',
            'Se ha producido un error recuperando los fabricantes'
          );
        } else {
          this.fabricantesMaestro = respuesta.fabricantes;
        }
      });
  }

  poblarModelos(fabricante: string) {
    this.logger$.enviarMensajeConsola(
      'buscarModeloDialog',
      `poblarModelos -> Dispositivo: ${
        this.buscarModeloForm.get('categoria').value
      }, fabricante: ${fabricante}`
    );

    this.dispositivo$
      .recuperaModelos(this.buscarModeloForm.get('categoria').value, fabricante)
      .subscribe((respuesta: any) => {
        if (!respuesta.modelos) {
          this.logger$.enviarMensajeConsola(
            'buscarModeloDialog',
            'Se ha producido un error recuperando los modelos'
          );
        } else {
          this.modelosMaestro = respuesta.modelos;
        }
      });
  }
  seleccionaModelo(modelo: Modelo) {
    this.logger$.enviarMensajeConsola(
      'buscarModeloDialog()',
      `Modelo seleccionado -> ${JSON.stringify(modelo)}`
    );
    this.modeloSeleccionado = modelo;
  }

  finalizar() {
    this.logger$.enviarMensajeConsola(
      'buscarModeloDialog',
      'Se va a cerrar el diálogo'
    );
    this.buscarModeloDialogRef.close(this.modeloSeleccionado);
  }
}
