// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { TipificacionDialogComponent } from './tipificacion-dialog/tipificacion-dialog.component';

// ************************************************************************************************
// *********************************** Tipado *****************************************************
// ************************************************************************************************
import { Descripcion } from './../../../../../Tipado/categorizacion';
import { Registro } from './../../../../../Tipado/entorno';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './../../../../../services/logger.service';
import { CategorizacionService } from './../../../../../services/categorizacion.service';

// ************************************************************************************************
// ********************************** Variables Globales ******************************************
// ************************************************************************************************
import { CELDAS } from './../../../../../config/entorno';


@Component({
  selector: 'app-tipificacion',
  templateUrl: './tipificacion.component.html',
  styleUrls: ['./tipificacion.component.css'],
})
export class TipificacionComponent implements OnInit, OnChanges {
  @Input() tipoRecibido: boolean;
  @Input() codigoRecibido: string;
  // @Input() dispositivosRecibidos: string[];
  @Input() dispositivosRecibidos: Registro[];

  @Output() enviarCategorizacionEvent = new EventEmitter<string>();

  categoriaForm: FormGroup;
  textoCategoria = new FormControl(null, Validators.required);

  categoriaTTTexto: string;
  categoriaTTClass: string;
  colorTexto: string;

  dispositivosUnicos: string[];

  estiloCelda: string;

  constructor(
    private fb: FormBuilder,
    private logger$: LoggerService,
    private categoria$: CategorizacionService,
    private tipificacionDialog: MatDialog
  ) {
    this.logger$.salidaPantalla(
      'INFO',
      'tipificacionComponent',
      'Se ha creado el componente tipificacionComponent'
    );

    this.construirFormulario();
  }

  ngOnInit(): void {
    this.estiloCelda = CELDAS;
    this.colorTexto = 'textoNegro';
  }

  ngOnChanges(cambios: SimpleChanges) {
    this.logger$.salidaPantalla(
      'INFO',
      'tipificacionComponente',
      `onChanges -> Se ha lanzado onChanges -> Cambios: ${JSON.stringify(
        cambios
      )}`
    );

    if (this.dispositivosRecibidos) {
      this.dispositivosUnicos = this.recuperaSoloUnicos(this.dispositivosRecibidos);
    }

    if (this.codigoRecibido) {
      this.logger$.salidaPantalla(
        'SEG',
        'tipificacionComponent',
        `ngOnChanges -> Se ha recibido un Código -> compruebaTexto(${this.codigoRecibido})`
      );

      this.compruebaTexto(this.codigoRecibido);

      return;
    }
  }

  construirFormulario() {
    this.logger$.salidaPantalla(
      'SEG',
      'tipificacionComponent',
      'construirFormulario()'
    );
    this.categoriaForm = this.fb.group({
      textoForm: this.textoCategoria,
    });
  }

  textoIntroducido(evento: any) {
    if (!(this.dispositivosRecibidos.length > 0)) {
      this.logger$.salidaPantalla(
        'ERR',
        'tipificacionComponent',
        `textoIntroducido -> NO SE HAN RECIBIDO dispositivos`
      );

      return;
    }

    this.logger$.salidaPantalla(
      'INFO',
      'tipificacionComponent',
      `textoIntroducido -> compruebaTexto(${evento.target.value})`
    );

    this.compruebaTexto(evento.target.value);

    return;
  }

  compruebaTexto(texto: string) {
    if (!texto) {
      this.logger$.salidaPantalla(
        'ERR',
        'tipificacionComponent',
        `compruebaTexto() -> NO SE HA INTRODUCIDO TEXTO`
      );

      return;
    }

    if (texto.length > 2) {
      this.logger$.salidaPantalla(
        'SEG',
        'tipificacionComponent',
        'compruebaTexto() -> textoIntroducido -> Vamos a comprobar si es un código o texto'
      );

      if (texto.slice(0, 2).toUpperCase() === 'D.') {
        this.logger$.salidaPantalla(
          'SEG',
          'tipificacionComponent',
          'compruebaTexto() -> textoIntroducido -> Es un DIAGNÓSTICO -> Comprobamos si estamos en el tipo correcto'
        );

        if (this.comprobarTipoCategoria(texto.slice(0, 2).toUpperCase())) {
          this.logger$.salidaPantalla(
            'SEG',
            'tipificacionComponent',
            `compruebaTexto() -> La categoria es correcta -> Lanzamos la consulta ->consultaPorCodigo(${texto})`
          );
        }

        this.consultaPorCodigo(texto);

        return;
      }

      if (texto.slice(0, 2).toUpperCase() === 'R.') {
        this.logger$.salidaPantalla(
          'SEG',
          'tipificacionComponent',
          'compruebaTexto() -> textoIntroducido -> Es una RESOLUCIÓN -> Comprobamos si estamos en el tipo correcto'
        );

        if (this.comprobarTipoCategoria(texto.slice(0, 2).toUpperCase())) {
          this.logger$.salidaPantalla(
            'SEG',
            'tipificacionComponent',
            'compruebaTexto() -> La categoria es correcta -> Lanzamos la consulta'
          );
        }

        this.consultaPorCodigo(texto);

        return;
      }

      this.logger$.salidaPantalla(
        'SEG',
        'tipificacionComponent',
        'compruebaTexto() -> Es un TEXTO libre -> Lanzamos la consulta'
      );

      this.consultaPorTexto(texto);

      return;
    }
  }

  comprobarTipoCategoria(tipo: string): boolean {
    this.logger$.salidaPantalla(
      'INFO',
      'tipificacionComponent',
      `comprobarTipoCategoria(${tipo})`
    );

    if (tipo === 'D.' && this.tipoRecibido) {
      this.logger$.salidaPantalla(
        'INFO',
        'tipificacionComponent',
        'Estamos ante una Descripción -> Categoría CORRECTA'
      );

      return true;
    }

    if (tipo === 'R.' && !this.tipoRecibido) {
      this.logger$.salidaPantalla(
        'INFO',
        'tipificacionComponent',
        'Estamos ante una Descripción -> Categoría CORRECTA'
      );

      return true;
    }

    this.logger$.salidaPantalla(
      'SEG',
      'tipificacionComponent',
      `El tipo de categorización NO ES CORRECTO: Tipo: ${tipo} y tipoRecibido: ${this.tipoRecibido}`
    );

    return false;
  }

  consultaPorCodigo(codigo: string) {
    this.logger$.salidaPantalla(
      'INFO',
      'tipificacionComponent',
      `consultaPorCodigo -> Vamos a lanzar la consulta con el codigo: ${codigo}`
    );

    this.categoria$
      .buscarCategoriaCodigo(codigo)
      .subscribe((respuesta: Descripcion[]) => {
        if (respuesta.length > 0) {
          this.logger$.salidaPantalla(
            'SEG',
            'tipificacionComponent',
            `consultaPorCodigo(${codigo}) -> Respuesta: ${JSON.stringify(
              respuesta
            )}`
          );

          this.gestionaToolTips(respuesta[0], false);

          return;
        }

        this.logger$.salidaPantalla(
          'INFO',
          'tipificacionComponent',
          `consultaPorCodigo(${codigo}) - > NO EXISTE categorización`
        );

        this.gestionaToolTips(
          { codigo: codigo, descripcion: 'NO existe ese CÓDIGO' },
          true
        );
        return;
      });
  }

  consultaPorTexto(texto: string) {
    this.logger$.salidaPantalla(
      'INFO',
      'tipificacionComponent',
      `consultaPorTexto -> Vamos a lanzar la consulta con el texto: ${texto}`
    );

    this.categoria$
      .buscarCategoriaTexto('D', texto, this.dispositivosRecibidos)
      .subscribe((respuesta: Descripcion[]) => {
        this.logger$.salidaPantalla(
          'INFO',
          'tipificacionComponent',
          `consultaPorTexto -> Respuesta -> ${JSON.stringify(respuesta)}`
        );

        if (respuesta.length === 1) {
          this.logger$.salidaPantalla(
            'INFO',
            'tipificacionComponent',
            'consultaPorTexto -> Tenemos una ÚNICA categorización -> gestionaToolTips'
          );

          this.gestionaToolTips(respuesta[0], false);

          return;
        }

        if (respuesta.length > 0) {
          this.logger$.salidaPantalla(
            'SEG',
            'tipificacionComponent',
            `consultaPor Texto -> Tenemos VARIAS categorizaciones -> Abrir Dialog`
          );

          this.abrirTipificacionDialog(respuesta);

          return;
        }

        this.logger$.salidaPantalla(
          'SEG',
          'tipificacionComponent',
          `consultaPor Texto -> NO tenemos categorizaciones`
        );

        this.gestionaToolTips(
          {
            codigo: 'None',
            descripcion: 'NO existen categorizaciones con ese TEXTO',
          },
          true
        );

        return;
      });
  }

  abrirTipificacionDialog(descripciones: Descripcion[]) {
    this.logger$.salidaPantalla(
      'SEG',
      'numeroComponent',
      'Estamos en abrirTipificacionDialog'
    );

    const tipificacionDialogConfig = new MatDialogConfig();
    tipificacionDialogConfig.disableClose = true;
    tipificacionDialogConfig.autoFocus = false;
    tipificacionDialogConfig.data = descripciones;

    const tipificacionDialogRef = this.tipificacionDialog.open(
      TipificacionDialogComponent,
      tipificacionDialogConfig
    );

    // Recogemos el valor enviado por el modal
    tipificacionDialogRef.afterClosed().subscribe((datos: Descripcion) => {
      if (datos) {
        this.logger$.salidaPantalla(
          'INFO',
          'tipificacionComponent',
          `Datos Recibidos desde el tipificacionDialogComponent -> ${JSON.stringify(
            datos
          )}`
        );

        return;
      }
    });
  }

  // ***************** Obtención de dispositivos únicos ***************************************
soloUnicos(valor: string, indice: number, self: string[]): boolean {
  return self.indexOf(valor) === indice;
}

recuperaSoloUnicos(listaDispositivos: Registro[]): string[] {
  this.logger$.salidaPantalla(
    'INFO',
    'datosComponent',
    `recuperaSoloUnicos -> ${JSON.stringify(listaDispositivos)}`
  );

  const dispositivosTemporal = [];

  listaDispositivos.forEach((elemento) => {
    dispositivosTemporal.push(elemento.modelo);
  });

  this.logger$.salidaPantalla(
    'INFO',
    'tipificacionComponent',
    `recuperaSoloUnicos -> DispositivosUnicos : ${dispositivosTemporal}`
  );

  return dispositivosTemporal;
}

  // ********************** Gestión de ToolTips ***********************************************
  gestionaToolTips(respuesta: Descripcion, error: boolean) {
    this.logger$.salidaPantalla(
      'SEG',
      'datosComponent',
      `Estamos en gestionaToolTips -> error: ${error}, Texto: ${respuesta.descripcion}`
    );

    if (error) {
      this.categoriaTTClass = 'fondoRojo';
      this.colorTexto = 'textoRojo';
      this.categoriaTTTexto = respuesta.descripcion;

      return;
    }

    this.colorTexto = 'textoNegro';
    this.categoriaForm.get('textoForm').setValue(respuesta.descripcion);
    this.categoriaTTClass = 'fondoLila';
    this.categoriaTTTexto = `Codigo: ${respuesta.codigo}`;

    return;
  }

  // ************************* Enviamos Categorizacion al Padre **************************************
  envioInformacion(categoria: string) {
    this.logger$.salidaPantalla(
      'SEG',
      'tipificacionComponent',
      `envioInformacion() -> Vamos a enviar la categorizacion: ${categoria}`
    );

    this.enviarCategorizacionEvent.emit(categoria);
  }
}
