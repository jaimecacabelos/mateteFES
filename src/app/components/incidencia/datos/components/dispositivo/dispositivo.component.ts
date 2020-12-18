// ************************************************************************************************
// ********************************** Componentes *************************************************
// ************************************************************************************************
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuscarModeloDialogComponent } from './../../../../comun/buscar-modelo-dialog/buscar-modelo-dialog.component';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from '../../../../../services/logger.service';
import { DispositivoService } from './../../../../../services/dispositivo.service';

// ************************************************************************************************
// *********************************** Modelos ****************************************************
// ************************************************************************************************
import { Modelo } from './../../../../../models/dispositivo.model';

// ************************************************************************************************
// ********************************** Variables Globales ******************************************
// ************************************************************************************************
import {
  MIN_CODEQP,
  MAX_CODEQP,
  CELDAS,
} from '../../../../../config/entorno';

interface Info {
  colorTexto: string;
  claseTT: string;
  textoTT: string;
}

interface Respuesta {
  equipo: string;
  numeroSerie: string;
  modelo: string;
  posicion?: number;
}

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.component.html',
  styleUrls: ['./dispositivo.component.css'],
})
export class DispositivoComponent implements OnInit {
  // *********** Formulario *******************************
  dispositivoForm: FormGroup;
  equipo = new FormControl(null, Validators.required);
  numSerie = new FormControl(null);
  modelo = new FormControl(null, Validators.required);

  tabOrder: number;
  estiloCelda: string;
  posicionTemporal: number;

  equipoInfo: Info = {
    colorTexto: 'textoRojo',
    claseTT: 'fondoRojo',
    textoTT: '',
  };

  modeloInfo: Info = {
    colorTexto: 'textoRojo',
    claseTT: 'fondoRojo',
    textoTT: '',
  };

  respuesta: Respuesta;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos,
    private fb: FormBuilder,
    private logger$: LoggerService,
    private dispositivo$: DispositivoService,
    private BuscarModeloDialog: MatDialog,
    private dispositivoDialogRef: MatDialogRef<DispositivoComponent>
  ) {
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.tabOrder = 1;
    this.estiloCelda = CELDAS;

    this.logger$.enviarMensajeConsola(
      'DispositivoComponent',
      `ngOnInit() -> Datos Recibidos: ${JSON.stringify(
        this.datos.dispositivo
      )}, posicion: ${this.datos.posicion}`
    );

    if (this.datos.posicion < 0) {
      this.logger$.enviarMensajeConsola(
        'DispositivoComponent',
        'No se cargan valores'
      );
      return;
    }
    this.verificarEquipo(this.datos.dispositivo.equipo);
    this.verificarNumSerie(this.datos.dispositivo.numeroSerie);
    this.verificarModelo(this.datos.dispositivo.modelo);
  }

  construirFormulario() {
    this.dispositivoForm = this.fb.group({
      equipo: this.equipo,
      numSerie: this.numSerie,
      modelo: this.modelo,
    });
  }
  /****************** Equipo ********************************/
  tramitarEquipo(evento: any) {
    const equipo = evento.target.value.toUpperCase();
    this.verificarEquipo(equipo);
  }

  verificarEquipo(equipo: string) {
    this.dispositivoForm.get('equipo').setValue(equipo);

    if (equipo) {
      this.logger$.enviarMensajeConsola(
        'DatosComponent -> DispositivoComponent',
        `tramitarEquipo -> Equipo enviado: ${equipo} -> Verificamos su longitud`
      );
      if (equipo.length >= MIN_CODEQP && equipo.length <= MAX_CODEQP) {
        this.logger$.enviarMensajeConsola(
          'DatosComponent -> DispositivoComponent',
          `tramitarEquipo -> Equipo enviado: ${equipo} -> Longitud Correcta`
        );
        this.equipoInfo.colorTexto = 'textoNegro';
        return;
      }
      this.logger$.enviarMensajeConsola(
        'DatosComponent -> DispositivoComponent',
        `tramitarEquipo -> Equipo enviado: ${equipo} -> LONGITUD INCORRECTA`
      );
      this.equipoInfo.colorTexto = 'textoRojo';
      this.equipoInfo.textoTT = 'Longitud Incorrecta';
      return;
    }

    if (!equipo) {
      this.logger$.enviarMensajeConsola(
        'DatosComponent -> DispositivoComponent',
        'tramitarEquipo -> NO SE HA ENVIADO EQUIPO'
      );
      return;
    }
  }

  /****************** Número de Serie ********************************/
  tramitarNumSerie(evento: any) {
    const ns = evento.target.value.toUpperCase();
    this.verificarNumSerie(ns);
  }

  verificarNumSerie(ns: string) {
    this.logger$.enviarMensajeConsola(
      'DatosComponent -> DispositivoComponent',
      `tramitarnumSerie -> Número de Serie enviado: ${ns}`
    );
    this.dispositivoForm.get('numSerie').setValue(ns);
  }

  /****************** Modelo ********************************/
  tramitarModelo(evento: any) {
    const model = evento.target.value.toUpperCase();
    this.verificarModelo(model);
  }

  verificarModelo(model: string) {
    if (model) {
      this.logger$.enviarMensajeConsola(
        'DatosComponent -> DispositivoComponent',
        `tramitarModelo -> Modelo enviado: ${model} `
      );

      this.dispositivoForm.get('modelo').setValue(model);

      // Se ha introducido un código de modelo, por lo que antes de lanzar la consulta verificamos la longitud mínima
      if (model.length > 3) {
        this.dispositivo$.verificaClave(model).subscribe((respuesta: any) => {
          if (respuesta.modelos) {
            this.logger$.enviarMensajeConsola(
              'DatosComponent -> DispositivoComponent',
              `tramitarModelo -> Hemos recibido respuesta -> ${JSON.stringify(
                respuesta
              )}`
            );
            this.gestionaToolTip(
              'modelo',
              false,
              `(${respuesta.modelos.categoria}) ${respuesta.modelos.fabricante} ${respuesta.modelos.modelo}`
            );

            return;
          }
          this.logger$.enviarMensajeConsola(
            'DatosComponent -> DispositivoComponent',
            'tramitarModelo -> NO HEMOS RECIBIDO MODELO'
          );
          this.gestionaToolTip('modelo', true, 'No existe modelo');
          return;
        });
        return;
      }
      this.gestionaToolTip(
        'modelo',
        true,
        'La longitud debe ser mayor a 3 caracteres'
      );
      return;
    }
    this.logger$.enviarMensajeConsola(
      'DatosComponent -> DispositivoComponent',
      'tramitarModelo -> No se ha enviado modelo -> Abrimos Diálogo'
    );
    this.abrirModeloDialogo();
    return;
  }

  abrirModeloDialogo() {
    this.logger$.enviarMensajeConsola(
      'DatosComponent -> DispositivoComponent',
      'abrirModeloDialogo()'
    );

    const buscarModeloDialogConfig = new MatDialogConfig();
    buscarModeloDialogConfig.disableClose = false; // Permite cerrar la ventana con ESC
    buscarModeloDialogConfig.autoFocus = false;

    const buscarModeloDialogRef = this.BuscarModeloDialog.open(
      BuscarModeloDialogComponent,
      buscarModeloDialogConfig
    );

    // Recogemos el valor enviado por el modal
    buscarModeloDialogRef.afterClosed().subscribe((modelo: Modelo) => {
      if (modelo) {
        this.logger$.enviarMensajeConsola(
          'DatosComponent -> DispositivoComponent',
          `abrirModeloDialog() -> Hemos recibido respuesta -> Modelo: ${JSON.stringify(
            modelo
          )}`
        );
        this.dispositivoForm.get('modelo').setValue(modelo.nombre);

        this.gestionaToolTip(
          'modelo',
          false,
          `(${modelo.categoria}) ${modelo.fabricante} ${modelo.modelo}`
        );
      }
      return;
    });
  }

  gestionaToolTip(campo: string, error: boolean, texto?: string) {
    this.logger$.enviarMensajeConsola(
      'DatosComponent -> DispositivoComponent',
      `gestionaToolTip() -> campo: ${campo}, error: ${error}, texto: ${
        texto || ''
      }}`
    );
    switch (campo) {
      case 'modelo':
        if (error) {
          this.modeloInfo.colorTexto = 'textoRojo';
          this.modeloInfo.textoTT = texto;
          this.modeloInfo.claseTT = 'fondoRojo';
          break;
        }
        this.modeloInfo.colorTexto = 'textoNegro';
        this.modeloInfo.textoTT = texto || '';
        this.modeloInfo.claseTT = 'fondoLila';
        break;
      default:
        break;
    }
  }

  /**************** Gestión de la posición ************************/
  gestionPosicion(pos: number) {
    if (this.datos.posicion < 0) {
      this.logger$.enviarMensajeConsola(
        'DispositivoComponent',
        'No incrementamos la posición ya que es un dispositivo nuevo'
      );
      return;
    }

    if (pos - this.datos.posicion === 1) {
      this.logger$.enviarMensajeConsola(
        'DispositivoComponent',
        `Ya se ha incrementado el índice: ${pos}`
      );
      return;
    }

    pos++;

    this.logger$.enviarMensajeConsola(
      'DispositivoComponent',
      `Se ha incrementado el índice: ${pos}`
    );

  }

  /************************ Cerrar ********************************/
  cerrar() {
    this.respuesta = {
      equipo: this.dispositivoForm.get('equipo').value,
      numeroSerie: this.dispositivoForm.get('numSerie').value,
      modelo: this.dispositivoForm.get('modelo').value,
      posicion: -1
    };

    if (!(this.datos.posicion < 0)) {
      this.logger$.enviarMensajeConsola(
        'DatosComponent -> DispositivoComponent',
        `cerrar() -> Posición -> ${this.datos.posicion}`
      );

      this.respuesta.posicion = this.datos.posicion;
    }

    this.logger$.enviarMensajeConsola(
      'DatosComponent -> DispositivoComponent',
      `cerrar() -> Datos Enviados -> ${JSON.stringify(this.respuesta)}`
    );

    this.dispositivoDialogRef.close(this.respuesta);
  }
}
