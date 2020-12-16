// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IncidenciasDialogComponent } from '../incidencias-dialog/incidencias-dialog.component';
import { Subscription } from 'rxjs';

// ************************************************************************************************
// *********************************** Tipado *****************************************************
// ************************************************************************************************
import { Incidencia } from './../../../Tipado/Incidencias';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from '../../../services/logger.service';
import { IncidenciaService } from './../../../services/incidencia.service';
import { IncidenciaObservableService } from './../../../services/incidencia-observable.service';


@Component({
  selector: 'app-numero',
  templateUrl: './numero.component.html',
  styleUrls: ['./numero.component.css'],
})
export class NumeroComponent implements OnInit, OnDestroy {
  // @Output() enviarInformacionEvent = new EventEmitter();
  incidenciaSubscripcion: Subscription;

  incidencia: Incidencia;
  incidencias: Incidencia[];

  incidenciaNumero: number;

  numeroForm: FormGroup;
  tipo = new FormControl('SPT', Validators.required);
  numero = new FormControl('', Validators.required);

  botonIncidencia = {
    clases: ['incidencia', 'oculto'],
    active: true,
    texto: 'Texto',
    color: 'primary',
  };

  constructor(
    private fb: FormBuilder,
    private _incidenciaObservable$: IncidenciaObservableService,
    private incidencia$: IncidenciaService,
    private logger$: LoggerService,
    private incidenciasDialog: MatDialog
  ) {
    this.logger$.enviarMensajeConsola(
      'Numero Component',
      'Iniciamos Componente -> Constructor'
    );
    this.construirFormulario();
  }

  ngOnInit(): void {

  this.incidencia = {
      tipo: null,
      numero: null,
      fecha: null,
      codCentro: null,
      dispositivo: [],
      descripcion: null,
      categoria: null,
      diario: null,
      resolucion: null,
      estado: 'NVA'
    };

  this.logger$.enviarMensajeConsola(
      'numeroComponent',
      'Iniciamos la Subscripcion a Incidencias'
    );

  this.incidenciaSubscripcion = this._incidenciaObservable$.incidenciaObservable$.subscribe(
      (respuesta: Incidencia) => {
        if (respuesta) {
          this.logger$.enviarMensajeConsola(
            'numeroComponent',
            `incidenciaSubscripcion -> ${JSON.stringify(respuesta)}`
          );
          // perform your other action from here
        }
      }
    );

  }

  ngOnDestroy(): void {
    this.incidenciaSubscripcion.unsubscribe();
  }

  construirFormulario() {
    this.logger$.enviarMensajeConsola(
      'NumeroComponent',
      'construirFormulario()'
    );
    this.numeroForm = this.fb.group({
      tipo: this.tipo,
      numero: this.numero,
    });
  }

  async onEnter() {
    this.logger$.enviarMensajeConsola(
      'NumeroComponent',
      'Hemos entrado en onEnter'
    );

    this.logger$.enviarMensajeConsola(
      'NumeroComponent',
      `Valor de incidencia -> ${JSON.stringify(this.incidencia)}`
    );

    this.incidencia.tipo = this.numeroForm.get('tipo').value;
    this.incidencia.numero = this.numeroForm.get('numero').value;

    if (this.incidencia.numero && this.incidencia.numero > 0) {

      this.logger$.enviarMensajeConsola(
        'NumeroComponent',
        `Llamamos al servicio incidencia$ : \incidencia\\${this.incidencia.tipo}\\${this.incidencia.numero}`
      );

      const respuesta = await this.localizarIncidencia(this.incidencia);

      this.logger$.enviarMensajeConsola(
        'numeroComponent',
        `onEnter() -> Tenemos resultado: ${JSON.stringify(respuesta)}`
      );

      if (respuesta && respuesta.length === 0) {
        this._incidenciaObservable$.gestionaIncidencia(this.incidencia);
        this.gestionBotonIncidencia(this.incidencia);
        return;
      }

      if (respuesta && respuesta.length === 1) {
        this._incidenciaObservable$.gestionaIncidencia(respuesta[0]);
        this.gestionBotonIncidencia(this.incidencia);
        return;
      }

      if (respuesta && respuesta.length > 1) {
        this.abrirIncidenciasDialog(respuesta);
        return;
      }
    }
  }

  async localizarIncidencia(incidencia: Incidencia) {
    return await this.incidencia$.buscarIncidencia(incidencia).toPromise();
  }


  abrirIncidenciasDialog(incidencias: Incidencia[]) {
    this.logger$.enviarMensajeConsola(
      'numeroComponent',
      'Estamos en abrirIncidenciasDialog'
    );

    const incidenciasDialogConfig = new MatDialogConfig();
    incidenciasDialogConfig.disableClose = true;
    incidenciasDialogConfig.autoFocus = false;
    incidenciasDialogConfig.data = incidencias;

    const incidenciasDialogRef = this.incidenciasDialog.open(
      IncidenciasDialogComponent,
      incidenciasDialogConfig
    );

    // Recogemos el valor enviado por el modal
    incidenciasDialogRef.afterClosed().subscribe((datos: Incidencia) => {
      if (datos) {
        this.numeroForm.get('numero').setValue(datos.numero);
        this.gestionBotonIncidencia(datos);
        this._incidenciaObservable$.gestionaIncidencia(datos);
        return;
      }
    });
  }

  gestionBotonIncidencia(incidencia: Incidencia) {
    this.logger$.enviarMensajeConsola(
      'Numero Component',
      `getionBontonIncidencia Número Incidencia: ${incidencia.numero}, estado: ${incidencia.estado}`
    );

    switch (incidencia.estado) {
      case 'NVA':
        this.botonIncidencia.texto = 'Nueva';
        // this.botonIncidencia.color = 'primary';
        this.botonIncidencia.clases = ['incidencia nueva'];
        break;
      case 'ABR':
        this.botonIncidencia.texto = 'Abierta';
        // this.botonIncidencia.color = 'primary';
        this.botonIncidencia.clases = ['incidencia abierta'];
        break;
      case 'ECS':
        this.botonIncidencia.texto = 'En Curso';
        // this.botonIncidencia.color = 'primary';
        this.botonIncidencia.clases = ['incidencia curso'];
        break;
      case 'CRR':
        this.botonIncidencia.texto = 'Cerrada';
        // this.botonIncidencia.color = 'accent';
        this.botonIncidencia.clases = ['incidencia cerrada'];
        break;
      default:
        break;
    }
  }

  // Vamos a enviar información al componente padre: IncidenciasComponent

  envioInformacion(incidencia: Incidencia) {
    this.logger$.enviarMensajeConsola(
      'NumeroComponent',
      'Ya tenemos valor final'
    );
    this.logger$.enviarMensajeConsola(
      'NumeroComponent',
      `Numero de incidencia final: ${incidencia.numero}, estado de incidencia final: ${incidencia.estado}`
    );

    // this.enviarInformacionEvent.emit(incidencia);
    this._incidenciaObservable$.gestionaIncidencia(incidencia);
  }
}
