// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { Modelo } from './../../../Tipado/dispositivo';
import { Categorizacion } from './../../../models/incidencia.model';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { CentroService } from './../../../services/centro.service';
import { DispositivoService } from './../../../services/dispositivo.service';
import { IncidenciaService } from './../../../services/incidencia.service';
import { IncidenciaObservableService } from './../../../services/incidencia-observable.service';
import { LoggerService } from './../../../services/logger.service';
import { UsuarioService } from './../../../services/usuario.service';
import { Dispositivo } from '../../../Tipado/Incidencias';


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
import { analyzeAndValidateNgModules } from '@angular/compiler';

interface Icono {
  codCentro: boolean;
  codModelo: boolean;
  modelo: boolean;
  tipoInicial: boolean;
  tipoFinal: boolean;
  usuarioCreador: boolean;
  usuarioCierre: boolean;
}

interface Registro {
  equipo: string;
  numeroSerie?: string;
  modelo: string;
  posicion?: number;
}

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
  usuarioCreador = new FormControl('', [
    Validators.required,
    Validators.minLength(MIN_CODUSU),
    Validators.maxLength(MAX_CODUSU),
  ]);
  categoriaInicial = new FormControl('', Validators.required);
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

  categoriasInicial: Categorizacion[];
  categoriasFinal: Categorizacion[];

  incidencia: Incidencia;

  tipoIcono: Icono;
  verIcono: Icono;
  boton: Icono;
  modeloSeleccionado: Modelo;

  // Almacenará los registros asociados a la incidencia
  dispositivoData: Registro[];

  constructor(
    private centro$: CentroService,
    private dispositivo$: DispositivoService,
    private logger$: LoggerService,
    private _incidenciaObservable$: IncidenciaObservableService,
    private incidencia$: IncidenciaService,
    private fb: FormBuilder,
    private BuscarCentroDialog: MatDialog,
    private BuscarDispositivoDialog: MatDialog,
    private BuscarModeloDialog: MatDialog,
    private BuscarUsuarioDialog: MatDialog // private dateAdapter: DateAdapter<Date>
  ) {
    this.construirFormulario();
    // this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    this.tabOrder = 30;

    this.logger$.enviarMensajeConsola(
      'DatosComponent',
      'Se ha creado DatosComponent'
    );

    this.logger$.enviarMensajeConsola(
      'DatosComponent',
      'Iniciamos la Subscripcion a Incidencias'
    );

    this.incidenciaSubscripcion = this._incidenciaObservable$.incidenciaObservable$.subscribe(
      (respuesta: Incidencia) => {
        if (respuesta) {
          this.incidencia = respuesta;
          this.cargarValores(this.incidencia);
        }
      }
    );

    this.estiloCelda = CELDAS;

    this.incializarVerIcono();
    this.inicializarTipoIcono();
    this.modeloSeleccionado = null;
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

  incializarVerIcono() {
    this.verIcono = {
      codCentro: false,
      codModelo: false,
      modelo: false,
      tipoInicial: false,
      tipoFinal: false,
      usuarioCreador: false,
      usuarioCierre: false,
    };
  }

  inicializarTipoIcono() {
    this.tipoIcono = {
      codCentro: false,
      codModelo: false,
      modelo: false,
      tipoInicial: false,
      tipoFinal: false,
      usuarioCreador: false,
      usuarioCierre: false,
    };
  }

  cargarValores(incidencia: Incidencia) {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `cargarValores -> ${JSON.stringify(incidencia)}`
    );

    if (incidencia.estado === 'NVA') {
      this.datosForm.get('fechaAlta').setValue(null);
      this.datosForm.get('codCentro').setValue(null);
      this.dispositivoData = incidencia.dispositivo;
      this.datosForm.get('descripcion').setValue(null);
      return;
    }
    this.datosForm.get('fechaAlta').setValue(incidencia.fecha[0].valor);
    this.datosForm.get('codCentro').setValue(incidencia.codCentro);
    this.dispositivoData = incidencia.dispositivo;
    this.datosForm.get('descripcion').setValue(incidencia.descripcion);
    return;
  }

  // ************************************* Funciones codCentro ***********************************
  onEnterCentro(evento: any) {
    this.logger$.enviarMensajeConsola('DatosComponent', 'Estamos en onEnter()');
    if (!evento.target.value.length) {
      this.logger$.enviarMensajeConsola(
        'DatosComponent',
        `Hemos entrado en onEnter con longitud: 0 `
      );
      this.abrirBuscarCentroDialog();
    } else {
      if (
        evento.target.value.length < MIN_CODCENTRO ||
        evento.target.value.length > MAX_CODCENTRO
      ) {
        this.logger$.enviarMensajeConsola('DatosComponent', 'Error en tamaño');
        this.verIcono.codCentro = true;
        this.tipoIcono.codCentro = false;
      } else {
        this.centro$
          .verificaClave(evento.target.value)
          .subscribe((respuesta: any) => {
            this.logger$.enviarMensajeConsola(
              'DatosComponent',
              `verificaClave: ${respuesta.Correcto}`
            );
            this.verIcono.codCentro = true;
            this.tipoIcono.codCentro = respuesta.Correcto;
            return;
          });
      }
    }
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
        this.verIcono.codCentro = true;
        this.tipoIcono.codCentro = true;
      }
    });
  }

  // ********************************** Funciones Dispositivo *************************************

  valorPulsadoDispositivo(registro: Registro) {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `valorPulsadoDispositivo: ${JSON.stringify(registro)}`
    );
    return;
  }

  addDispositivo() {
    this.logger$.enviarMensajeConsola(
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
      `addDispositivo -> Se ha llamado a abrirDispositivoDialog(indice: ${indice}, registro: ${JSON.stringify(registro)})`
    );

    const buscarDispositivoDialogConfig = new MatDialogConfig();
    buscarDispositivoDialogConfig.disableClose = false;
    buscarDispositivoDialogConfig.autoFocus = false;
    buscarDispositivoDialogConfig.data = {
        posicion: indice,
        dispositivo: registro
    };

    const buscarDispositivoDialogRef = this.BuscarDispositivoDialog.open(
      DispositivoComponent,
      buscarDispositivoDialogConfig
    );

    // Recogemos los valores
    buscarDispositivoDialogRef
      .afterClosed()
      .subscribe((dispositivo: Registro) => {
        if (dispositivo.modelo) {
          this.logger$.enviarMensajeConsola(
            'datosComponent',
            `abrirDispositivoDialog -> Recibimos respuesta -> ${JSON.stringify(
              dispositivo
            )}`
          );

          if ( dispositivo.posicion < 0) {
            this.insertarDispositivo(dispositivo);
            return;
          }

          this.actualizarDispositivo(dispositivo);

        }
      });
  }

  actualizarDispositivo(dispositivo: Registro) {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `actualizarDispositivo -> Respuesta Recibida -> Modificamos el elemento de la posición ${dispositivo.posicion}`
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

  onEnterModelo(evento: any) {
    this.verIcono.codModelo = false;

    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `onEnterModelo -> ${evento.target.value}`
    );

    if (!evento.target.value.length) {
      this.logger$.enviarMensajeConsola(
        'datosComponent',
        'No tenemos longitud en codModelo -> Abrir diálogo'
      );

      this.abrirModeloDialog();
    } else {
      this.logger$.enviarMensajeConsola(
        'datosComponent',
        `Tenemos longitud en codModelo -> Tramitar cadena longitud: ${evento.target.value.length}`
      );

      if (!(evento.target.value.length > 3)) {
        this.logger$.enviarMensajeConsola(
          'datosComponent',
          'onEnterModelo -> Longitud < 4'
        );
      } else {
        this.logger$.enviarMensajeConsola(
          'datosComponent',
          'onEnterModelo -> Longitud > 3, Llamamos a verificarCodModelo'
        );
        this.verificaCodModelo(evento.target.value);
      }
    }
  }

  verificaCodModelo(codModelo: string) {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `Estamos en verificaModelo`
    );

    this.dispositivo$.verificaClave(codModelo).subscribe((respuesta: any) => {
      if (respuesta.modelos) {
        this.modeloSeleccionado = respuesta.modelos;
        this.tipoIcono.modelo = respuesta.Correcto;
        this.verIcono.modelo = true;

        this.poblarTipificaciones(respuesta.modelos.categoria);
      } else {
        this.tipoIcono.modelo = respuesta.Correcto;
        this.verIcono.modelo = true;
      }
    });
  }

  abrirModeloDialog() {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      'Estamos en abrirModeloDialog'
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
        // this.modeloSeleccionado = modelo;
        this.datosForm.get('modelo').setValue(modelo.nombre);
        this.verIcono.modelo = true;
        this.tipoIcono.modelo = true;

        this.poblarTipificaciones(modelo.categoria);
      }
    });
  }

  // ***************************** Funciones Usuario ***********************************************

  usuarioRecibido(usuarioRecibido: string) {
    this.logger$.enviarMensajeConsola(
      'diarioComponent',
      `usuarioRecibido -> Se ha recibido el usuario ${usuarioRecibido}`
    );
    this.datosForm.get('usuarioCreador').setValue(usuarioRecibido);
  }

  usuarioFin(usuarioRecibido: string) {
    this.logger$.enviarMensajeConsola(
      'diarioComponent',
      `usuarioFin -> Se ha recibido el usuario ${usuarioRecibido}`
    );
    this.datosForm.get('usuarioCierre').setValue(usuarioRecibido);
  }

  // ***************************** Funciones tipificación ***********************************

  poblarTipificaciones(dispositivo: string) {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `cargarTipificaciones -> ${dispositivo} -> cargarTipificaciones()`
    );

    this.cargarTipificaciones('d', dispositivo);
    this.cargarTipificaciones('r', dispositivo);
  }

  cargarTipificaciones(tipo: string, dispositivo: string) {
    this.logger$.enviarMensajeConsola(
      'datosComponent',
      `cargarTipificaciones -> campo: ${tipo}, ${dispositivo} -> Llamamos al servicio`
    );

    this.incidencia$
      .recuperaCategorizacion(tipo, dispositivo)
      .subscribe((respuesta: any) => {
        if (!respuesta) {
          this.logger$.enviarMensajeConsola(
            'datosComponent',
            `No se han recuperado tipificaciones`
          );
          return;
        }
        if (tipo === 'd') {
          this.categoriasInicial = respuesta.categorias;
        }

        if (tipo === 'r') {
          this.categoriasFinal = respuesta.categorias;
        }
      });
  }

  // ********************** Funciones visibilidad y tipado del icono **************************

  visibilidad(tipo: string, valor: boolean) {
    if (tipo === 'creador') {
      this.verIcono.usuarioCreador = valor;
      return;
    }

    if (tipo === 'cierre') {
      this.verIcono.usuarioCierre = valor;
      return;
    }
  }

  tipado(tipo: string, valor: boolean) {
    if (tipo === 'creador') {
      this.tipoIcono.usuarioCreador = valor;
      return;
    }

    if (tipo === 'cierre') {
      this.tipoIcono.usuarioCierre = valor;
      return;
    }
  }
}
