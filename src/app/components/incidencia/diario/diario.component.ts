//************************************************************************************************
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
import { MatTable } from '@angular/material/table';
import { BuscarUsuarioComponent } from '../../comun/buscar-usuario/buscar-usuario.component';
import { Subscription } from 'rxjs';

// ************************************************************************************************
// *********************************** librerias **************************************************
// ************************************************************************************************
import { fechaToISO, fechaToString } from './../../../librerias/fechas';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './../../../services/logger.service';

// ************************************************************************************************
// ********************************** Variables Globales ******************************************
// ************************************************************************************************
import { CELDAS } from '../../../config/entorno';

interface Registro {
  fecha: string;
  usuario: string;
  texto: string;
  tarea: string;
}

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css'],
})
export class DiarioComponent implements OnInit {
  @ViewChild(MatTable) diarioTabla: MatTable<Registro>;
  @ViewChild(BuscarUsuarioComponent) buscarUsuario: BuscarUsuarioComponent;


  diarioForm: FormGroup;
  fecha = new FormControl(null, Validators.required);
  usuario = new FormControl(null);

  texto = new FormControl(null, Validators.required);
  tarea = new FormControl(null, Validators.required);

  matcher = new MyErrorStateMatcher();

  diarioData: Registro[];
  mostrarColumnas = ['fecha', 'usuario', 'texto', 'tarea'];

  tabOrder: number;
  estiloCelda: string;

  constructor(private logger$: LoggerService, private fb: FormBuilder) {
    this.inicializaFormulario();
  }

  ngOnInit(): void {
    this.estiloCelda = CELDAS;
    this.diarioData = [];
    this.tabOrder = 40;
  }


  inicializaFormulario() {
    this.diarioForm = this.fb.group({
      fecha: this.fecha,
      usuario: this.usuario,
      texto: this.texto,
      tarea: this.tarea,
    });
  }

  // ********************************** Funciones de Usuario ******************************************
  usuarioRecibido(usuarioRecibido: string) {
    this.logger$.enviarMensajeConsola(
      'diarioComponent',
      `usuarioRecibido -> Se ha recibido el usuario ${usuarioRecibido}`
    );
    this.diarioForm.get('usuario').setValue(usuarioRecibido);
    this.diarioForm.get('usuario').setValidators(Validators.required);
  }

  // ********************************** Funciones de los botones *************************************

  addRegistro(index?: number) {
    this.logger$.enviarMensajeConsola(
      'diarioComponent',
      `Se ha pulsado click en Añadir Registro -> Índice: ${
        index || 'No definido'
      }`
    );

    this.logger$.enviarMensajeConsola(
      'diarioComponent',
      `Formulario Válido? : ${this.diarioForm.valid}`
    );

    this.logger$.enviarMensajeConsola(
      'diarioComponent',
      `Valor de Usuario : ${this.diarioForm.get('usuario').value}`
    );

    if (this.diarioForm.valid) {
      this.diarioData.push({
        fecha: fechaToString(this.diarioForm.get('fecha').value),
        usuario: this.diarioForm.get('usuario').value,
        texto: this.diarioForm.get('texto').value,
        tarea: this.diarioForm.get('tarea').value,
      });

      this.logger$.enviarMensajeConsola(
        'diarioComponent',
        `Registros Almacenados -> ${JSON.stringify(
          this.diarioData
        )} \n Longitud de Array: ${this.diarioData.length}`
      );
      if (this.diarioData.length > 1) {
        this.diarioTabla.renderRows();
      }

      this.reseteaFormulario();
    } else {
      this.logger$.enviarMensajeConsola(
        'diarioComponent',
        `Registros NO Almacenados -> ${JSON.stringify(this.diarioData)}`
      );
    }
  }

  valorPulsado(registro: Registro) {
    this.logger$.enviarMensajeConsola(
      'diarioComponent',
      `valorPulsado() -> ${JSON.stringify(
        registro
      )}, en la posición ${this.diarioData.indexOf(registro)}`
    );

    this.diarioForm.get('fecha').setValue(fechaToISO(registro.fecha));
    this.diarioForm.get('texto').setValue(registro.texto);
    this.diarioForm.get('tarea').setValue(registro.tarea);
  }

  envio() {
    this.logger$.enviarMensajeConsola(
      'diarioComponent',
      `envio() -> Se va a enviar los datos del formulario.\n ${this.diarioForm}`
    );
  }

  reseteaFormulario() {
    this.logger$.enviarMensajeConsola(
      'diarioComponent',
      `reseteaFormulario() -> Se va a limpiar el formulario`
    );

    this.buscarUsuario.estableceUsuario();
    this.diarioForm.reset();
  }
}
