// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './../../../services/logger.service';

// ************************************************************************************************
// *********************************** Modelos ****************************************************
// ************************************************************************************************
import { Incidencia } from './../../../models/incidencia.model';

@Component({
  selector: 'app-incidencias-dialog',
  templateUrl: './incidencias-dialog.component.html',
  styleUrls: ['./incidencias-dialog.component.css'],
})

export class IncidenciasDialogComponent implements OnInit, OnDestroy {
  mostrarColumnas = ['numero', 'estado', 'descripcion'];
  incidencias: Incidencia[];
  textoEstadoBoton = 'Nueva';

  constructor(
    private logger$: LoggerService,
    private incidenciasDialogRef: MatDialogRef<IncidenciasDialogComponent>,

    @Inject(MAT_DIALOG_DATA) data: Incidencia[]
  ) {
    this.logger$.enviarMensajeConsola(
      'IncidenciasDialogComponent',
      'Vamos a cargar los datos de la incidencia en el diálogo'
    );
    this.incidencias = data;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.logger$.enviarMensajeConsola(
      'IncidenciasDialogComponent',
      'Se va a destruir el IncidenciasDialogComponent'
    );
  }

  transformaEstado(abreviado: string) {
    switch (abreviado) {
      case 'ABR':
        this.textoEstadoBoton = 'Abierta';
        return ['incidencia abierta'];
      case 'ECS':
        this.textoEstadoBoton = 'En Curso';
        return ['incidencia curso'];
      case 'CRR':
        this.textoEstadoBoton = 'Cerrada';
        return ['incidencia cerrada'];
      case 'NVA':
        this.textoEstadoBoton = 'Nueva';
        return ['incidencia abierta'];
      default:
        this.textoEstadoBoton = 'Nueva';
        return ['incidencia abierta'];
    }
  }

  valorPulsado(incidencia: Incidencia) {
    this.incidenciasDialogRef.close(incidencia);
  }

  cerrar() {
    this.logger$.enviarMensajeConsola(
      'IncidenciasDialogComponent',
      'Se ha pulsado el botón CERRAR'
    );
    this.incidenciasDialogRef.close();
  }
}
