// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Component, OnInit, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MyErrorStateMatcher } from './../../../librerias/MyErrorStateMatcher';
// import { DateAdapter } from '@angular/material/core';
import {
  MatDialog,
  MatDialogConfig,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { BuscarCentroDialogComponent } from './../../comun/buscar-centro-dialog/buscar-centro-dialog.component';
import { DispositivoComponent } from './components/dispositivo/dispositivo.component';
import { BuscarModeloDialogComponent } from './../../comun/buscar-modelo-dialog/buscar-modelo-dialog.component';
import { Subscription } from 'rxjs';

// ************************************************************************************************
// *********************************** Tipado *****************************************************
// ************************************************************************************************

import { Incidencia } from './../../../Tipado/Incidencias';
import { Categorizacion } from './../../../models/incidencia.model';
import { Registro, ToolTipInfo } from './../../../Tipado/entorno';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { CentroService } from './../../../services/centro.service';
import { IncidenciaService } from './../../../services/incidencia.service';
import { IncidenciaObservableService } from './../../../services/incidencia-observable.service';
import { LoggerService } from './../../../services/logger.service';

// ************************************************************************************************
// ********************************** Variables Globales ******************************************
// ************************************************************************************************
import {
  MIN_CODCENTRO,
  MAX_CODCENTRO,
  MIN_CODUSU,
  MAX_CODUSU,
  MIN_CODEQP,
  MAX_CODEQP,
  CELDAS,
} from '../../../config/entorno';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css'],
})
export class DatosComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) dispositivoTabla: MatTable<Registro>;

  // *********** Formulario *******************************
  datosForm: FormGroup;
  fechaAlta = new FormControl('', Validators.required);
  codCentro = new FormControl(null, [
    Validators.required,
    Validators.minLength(MIN_CODCENTRO),
    Validators.maxLength(MAX_CODCENTRO),
  ]);
  equipo = new FormControl('', [
    Validators.minLength(MIN_CODEQP),
    Validators.maxLength(MAX_CODEQP),
  ]);
  numeroSerie = new FormControl('');
  modelo = new FormControl('', Validators.required);
  descripcion = new FormControl('', Validators.required);
  usuarioCreador = new FormControl(null, [
    Validators.required,
    Validators.minLength(MIN_CODUSU),
    Validators.maxLength(MAX_CODUSU),
  ]);
  categoriaInicial = new FormControl(null, Validators.required);
  resolucion = new FormControl('');
  fechaCierre = new FormControl('');
  usuarioCierre = new FormControl('', [
    Validators.minLength(MIN_CODUSU),
    Validators.maxLength(MAX_CODUSU),
  ]);
  categoriaFinal = new FormControl('');

  // *********** Subscripción *******************************
  private incidenciaSubscripcion: Subscription;

  matcher = new MyErrorStateMatcher();

  tabOrder: number;
  estiloCelda: string;

  mostrarColumnasDispositivo = [
    'equipo',
    'numeroSerie',
    'modelo',
    'iconoEditar',
    'iconoBorrar',
  ];

  categoriasFinal: Categorizacion[];
  dispositivosUnicos: string[];

  incidencia: Incidencia;

  // *********** ToolTips *******************************
  codCentroTT: ToolTipInfo = {
    colorTexto: 'textoRojo',
    clase: 'fondoRojo',
    texto: '',
  };

  // Almacenará los registros asociados a la incidencia
  dispositivoData: Registro[];

// codigoDescripcion: string;

  constructor(
    private centro$: CentroService,
    private logger$: LoggerService,
    private _incidenciaObservable$: IncidenciaObservableService,
    private incidencia$: IncidenciaService,
    private fb: FormBuilder,
    private BuscarCentroDialog: MatDialog,
    private BuscarDispositivoDialog: MatDialog,
    // private dateAdapter: DateAdapter<Date>
  ) {

    this.logger$.salidaPantalla(
      'INFO',
      'datosComponent',
      'Iniciamos Componente DATOS -> Constructor'
    );

    this.incidenciaSubscripcion = this._incidenciaObservable$.incidenciaObservable$.subscribe(
      (respuesta: Incidencia) => {
        if (respuesta) {
          this.logger$.salidaPantalla(
            'INFO',
            'DatosComponent',
            `incidenciaSubscripcion -> respuesta: ${JSON.stringify(respuesta)}`
          );

          this.incidencia = respuesta;
          this.cargarValores(this.incidencia);
          return;
        }

        this.logger$.salidaPantalla(
          'ERR',
          'DatosComponent',
          `incidenciaSubscripcion -> respuesta: ${JSON.stringify(respuesta)}`
        );
      }
    );

    this.construirFormulario();
    // this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    this.estiloCelda = CELDAS;
    this.tabOrder = 30;
    this.dispositivoData = [];
  }

  ngOnDestroy(): void {
    this.incidenciaSubscripcion.unsubscribe();
  }

  construirFormulario() {
    this.datosForm = this.fb.group({
      fechaAlta: this.fechaAlta,
      codCentro: this.codCentro,
      equipo: this.equipo,
      numeroSerie: this.numeroSerie,
      modelo: this.modelo,
      descripcion: this.descripcion,
      usuarioCreador: this.usuarioCreador,
      categoriaInicial: this.categoriaInicial,
      resolucion: this.resolucion,
      fechaCierre: this.fechaCierre,
      usuarioCierre: this.usuarioCierre,
      categoriaFinal: this.categoriaFinal,
    });
  }

  cargarValores(incidenciaRecibida: Incidencia) {
    this.logger$.salidaPantalla(
      'SEG',
      'datosComponent',
      `cargarValores -> ${JSON.stringify(incidenciaRecibida)}`
    );

    this.datosForm.get('fechaAlta').setValue(incidenciaRecibida.fecha[0].valor);
    this.datosForm.get('codCentro').setValue(incidenciaRecibida.codCentro);
    this.dispositivoData = incidenciaRecibida.dispositivo;
    this.datosForm.get('usuarioCreador').setValue(incidenciaRecibida.descripcion.usuario);
    this.datosForm
        .get('descripcion')
        .setValue(incidenciaRecibida.descripcion.texto);
    this.datosForm
      .get('categoriaInicial')
      .setValue(incidenciaRecibida.categoria[0].valor);
    this.datosForm.get('resolucion').setValue(incidenciaRecibida.resolucion.texto);
    this.datosForm.get('usuarioCierre').setValue(incidenciaRecibida.resolucion.usuario);
    this.datosForm.get('fechaCierre').setValue(incidenciaRecibida.fecha[1].valor);

    // this.recuperaSoloUnicos(this.dispositivoData);

    return;
  }

  // ************************************* Funciones codCentro ***********************************
  onCentro(evento: any) {
    // Evitamos que el evento se propague, así solo saltará el debido al botón de borrar
    // y no el de pulsar la fila de la tabla.
    evento.stopPropagation();

    this.logger$.salidaPantalla(
      'SEG',
      'datosComponent',
      'Estamos en onCentro()'
    );

    if (evento.target.value) {
      evento.target.value = evento.target.value.toUpperCase(); // Pasamos el valor a mayúscula
    }

    if (!evento.target.value.length) {
      this.logger$.salidaPantalla(
        'INFO',
        'datosComponent',
        'onCentro() -> Longitud 0 -> Llamamos a abrirBuscarCentroDialog()'
      );

      this.abrirBuscarCentroDialog();

      return;
    }

    if (
      evento.target.value.length < MIN_CODCENTRO ||
      evento.target.value.length > MAX_CODCENTRO
    ) {
      this.logger$.salidaPantalla(
        'ERR',
        'datosComponent',
        'onCentro -> Longitud INCORRECTA'
      );
      // Aqui tenemos que añadir la lógica para la gestión del tooltip
      this.gestionaToolTips('codCentro', true, 'Longitud INCORRECTA');

      return;
    }

    this.centro$
      .verificaClave(evento.target.value)
      .subscribe((respuesta: any) => {
        if (respuesta.centro) {
          this.logger$.salidaPantalla(
            'SEG',
            'datosComponent',
            `onEnter -> verificaClave(${evento.target.value}) -> Hay centro`
          );
          this.gestionaToolTips(
            'codCentro',
            false,
            `${respuesta.centro.centro}`
          );
          return;
        }

        this.logger$.salidaPantalla(
          'SEG',
          'datosComponent',
          `onEnter -> verificaClave(${evento.target.value}) -> NO Hay centro`
        );
        this.gestionaToolTips('codCentro', true, 'NO Existe centro');
        return;
      });
  }

  abrirBuscarCentroDialog() {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      'Estamos en abrirBuscarCentroDialog'
    );

    const buscarCentroDialogConfig = new MatDialogConfig();
    buscarCentroDialogConfig.disableClose = false;
    buscarCentroDialogConfig.autoFocus = false;

    const buscarCentroDialogRef = this.BuscarCentroDialog.open(
      BuscarCentroDialogComponent,
      buscarCentroDialogConfig
    );

    // Recogemos el valor enviado por el modal
    buscarCentroDialogRef.afterClosed().subscribe((centro: string) => {
      if (centro) {
        this.datosForm.get('codCentro').setValue(centro);

        this.logger$.enviarMensajeConsola(
         'SEG',
         `datosComponent -> Hemos obtenido centro ->
          Llamamos a gestionaToolTips(modulo: codCentro, error: false, texto:)`
        );

        this.gestionaToolTips('codCentro', false, '');
      }
    });
  }

  // ********************************** Funciones Dispositivo *************************************

  valorPulsadoDispositivo(registro: Registro) {
    this.logger$.salidaPantalla(
      'SEG',
      'datosComponent',
      `valorPulsadoDispositivo: ${JSON.stringify(registro)}`
    );
    return;
  }


  addDispositivo() {
    this.logger$.salidaPantalla(
      'SEG',
      'datosComponent',
      'Se ha pulsado sobre añadir dispositivo'
    );
    // Se llama a abrirFormulario para proceder a introducir los datos de los formularios
    this.abrirDispositivoDialog(-1, null);
  }

  borrarDispositivo(evento: any, registro: Registro) {
    // Evitamos que el evento se propague, así solo saltará el debido al botón de borrar
    // y no el de pulsar la fila de la tabla.
    evento.stopPropagation();

    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `Se ha pulsado sobre borrar dispositivo -> ${JSON.stringify(
        registro
      )}, en la posición ${this.dispositivoData.indexOf(registro)}`
    );
    this.eliminarDispositivo(registro);
  }

  editarDispositivo(evento: any, registro: Registro) {
    // Evitamos que el evento se propague, así solo saltará el debido al botón de borrar
    // y no el de pulsar la fila de la tabla.
    evento.stopPropagation();

    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `Se ha pulsado sobre editar dispositivo -> ${JSON.stringify(
        registro
      )}, en la posición ${this.dispositivoData.indexOf(registro)}`
    );

    this.abrirDispositivoDialog(
      this.dispositivoData.indexOf(registro),
      registro
    );
  }

  abrirDispositivoDialog(indice: number, registro?: Registro) {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `addDispositivo -> Se ha llamado a abrirDispositivoDialog(indice: ${indice}, registro: ${JSON.stringify(
        registro
      )})`
    );

    const buscarDispositivoDialogConfig = new MatDialogConfig();
    buscarDispositivoDialogConfig.disableClose = false;
    buscarDispositivoDialogConfig.autoFocus = false;
    buscarDispositivoDialogConfig.data = {
      posicion: indice,
      dispositivo: registro,
    };

    const buscarDispositivoDialogRef = this.BuscarDispositivoDialog.open(
      DispositivoComponent,
      buscarDispositivoDialogConfig
    );

    // Recogemos los valores
    buscarDispositivoDialogRef
      .afterClosed()
      .subscribe((dispositivo: Registro) => {
        if (!dispositivo) {
          this.logger$.salidaPantalla(
            'INFO',
            'datosComponent',
            'abrirDispositivoDialog -> buscarDispositivoDialogRef -> NO SE HA RECIBIDO RESPUESTA'
          );
          return;
        }
        if (dispositivo.modelo) {
          this.logger$.enviarMensajeConsola(
            'datosComponent',
            `abrirDispositivoDialog -> Recibimos respuesta -> ${JSON.stringify(
              dispositivo
            )}`
          );

          if (dispositivo.posicion < 0) {
            this.insertarDispositivo(dispositivo);
            return;
          }

          this.actualizarDispositivo(dispositivo);
        }
      });
  }

  actualizarDispositivo(dispositivo: Registro) {
    this.logger$.salidaPantalla(
      'SEG',
      'datosComponent',
      `actualizarDispositivo() -> Respuesta Recibida -> Modificamos el elemento de la posición ${dispositivo.posicion}`
    );

    this.dispositivoData[dispositivo.posicion] = dispositivo;
    this.dispositivoTabla.renderRows();
  }

  eliminarDispositivo(dispositivo: Registro) {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `eliminarDispositivo -> Eliminamos el dispositivo de la posición ${dispositivo.posicion}`
    );
    this.dispositivoData.splice(dispositivo.posicion, 1);
    this.dispositivoTabla.renderRows();
  }

  insertarDispositivo(dispositivo: Registro) {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      'insertarDispositivo -> Respuesta Recibida -> Nuevo elemento del array'
    );

    this.dispositivoData.push(dispositivo);
    this.dispositivoTabla.renderRows();
  }

  // ***************************** Funciones Usuario ***********************************************

  usuarioRecibido(creador: boolean, usuarioRecibido: string) {

    if (creador) {
      this.logger$.salidaPantalla(
        'INFO',
        'diarioComponent',
        `usuarioRecibido -> Se ha recibido el usuario Creador: ${usuarioRecibido}`
      );

      this.datosForm.get('usuarioCreador').setValue(usuarioRecibido);

      return;
    }

    this.logger$.salidaPantalla(
      'INFO',
      'datosComponent',
      `usuarioRecibido -> Se ha recibido el usuario Finalizador: ${usuarioRecibido}`
    );

    return;
  }

usuarioFin(usuarioRecibido: string) {
    this.logger$.enviarMensajeConsola(
      'diarioComponent',
      `usuarioFin -> Se ha recibido el usuario ${usuarioRecibido}`
    );
    this.datosForm.get('usuarioCierre').setValue(usuarioRecibido);
  }


// ********************** Gestión de ToolTips ***********************************************

gestionaToolTips(modulo: string, error: boolean, texto: string) {
    this.logger$.salidaPantalla(
      'SEG',
      'datosComponent',
      'Estamos en gestionaToolTips'
    );

    if (modulo === 'codCentro') {
      this.codCentroTT.texto = texto  || '';

      if (error) {
        this.logger$.salidaPantalla(
          'INFO',
          'datosComponent',
          `gestionaToolTips () -> modulo: ${modulo}, error?: ${error}, texto: ${texto}`
        );

        this.codCentroTT.colorTexto = 'textoRojo';
        this.codCentroTT.clase = 'fondoRojo';
        return;
      }

      this.logger$.salidaPantalla(
        'INFO',
        'datosComponent',
        `gestionaToolTips () -> modulo: ${modulo}, error?: ${error}, texto: ${texto}`
      );

      this.codCentroTT.colorTexto = 'textoNegro';
      this.codCentroTT.clase = 'fondoLila';

    }
  }

}
