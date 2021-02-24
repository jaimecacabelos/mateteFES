// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from '../../../../../../services/logger.service';

// ************************************************************************************************
// *********************************** Tipado *****************************************************
// ************************************************************************************************
import { Descripcion } from './../../../../../../Tipado/Incidencias';

@Component({
  selector: 'app-tipificacion-dialog',
  templateUrl: './tipificacion-dialog.component.html',
  styleUrls: ['./tipificacion-dialog.component.css'],
})
export class TipificacionDialogComponent implements OnInit, OnDestroy {
  mostrarColumnas = ['codigo', 'descripcion', 'conjunto'];
  descripciones: Descripcion[];

  constructor(
    private logger$: LoggerService,
    private tipificacionDialogRef: MatDialogRef<TipificacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Descripcion[]
  ) {
    this.logger$.salidaPantalla(
      'INFO',
      'IncidenciasDialogComponent',
      `Vamos a cargar los datos de la incidencia en el diálogo -> ${JSON.stringify(data)}`
    );

    this.descripciones = data;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.logger$.salidaPantalla(
      'INFO',
      'tipificacionDialogComponent',
      'Se va a destruir el tipificacionDialogComponent'
    );
  }

  valorPulsado(tipificacion: Descripcion) {
    this.logger$.salidaPantalla(
      'SEG',
      'tipificacionDialogComponent',
      `valorPulsado() -> ${JSON.stringify(tipificacion)}`
    );

    return;
  }

  cerrar() {
    this.logger$.salidaPantalla(
      'INFO',
      'tipificacionDialogComponent',
      'Se ha pulsado el botón CERRAR'
    );
    this.tipificacionDialogRef.close();
  }
}
