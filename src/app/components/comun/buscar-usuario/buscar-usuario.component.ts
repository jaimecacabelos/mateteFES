/*************************************************************************************************
************************************ Components **************************************************
**************************************************************************************************/
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChanges} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BuscarUsuarioDialogComponent } from './../../comun/buscar-usuario-dialog/buscar-usuario-dialog.component';

/*************************************************************************************************
************************************ Servicios ***************************************************
**************************************************************************************************/
import { LoggerService } from './../../../services/logger.service';
import { UsuarioService } from './../../../services/usuario.service';

/*************************************************************************************************
************************************** Tipado ****************************************************
**************************************************************************************************/
import { RespuestaUsuario, Usuario } from './../../../Tipado/usuario';

/*************************************************************************************************
******************************** Variables Globales **********************************************
**************************************************************************************************/
import {
  CELDAS
} from '../../../config/entorno';

@Component({
  selector: 'app-buscar-usuario',
  templateUrl: './buscar-usuario.component.html',
  styleUrls: ['./buscar-usuario.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BuscarUsuarioComponent implements OnInit, OnChanges {
  @Input() usuarioRecibido: string;
  @Output() enviarUsuarioEvent = new EventEmitter<string>();

  estiloCelda: string;
  usuario: string;
  usuarioToolTip: string;
  usuarioToolTipClass: string;
  colorTexto: string;

  constructor(
    private logger$: LoggerService,
    private usuario$: UsuarioService,
    private BuscarUsuarioDialog: MatDialog
  ) {
    this.logger$.enviarMensajeConsola(
      'buscarUsuarioComponent',
      'Estamos en el constructor'
    );
  }

  ngOnInit(): void {
    this.estiloCelda = CELDAS;
    this.inicializaEntorno();
  }

  ngOnChanges(cambios: SimpleChanges) {
    this.logger$.salidaPantalla(
      'INFO',
      'buscarUsuarioComponente',
      `onChanges -> Cambios: ${JSON.stringify(cambios)}`
    );

    if (this.usuarioRecibido) {
      this.logger$.salidaPantalla(
        'SEG',
        'buscarUsuarioComponent',
        `ngOnChanges -> compruebaUsuario(${this.usuarioRecibido})`
      );

      this.usuario = this.usuarioRecibido;
      this.compruebaUsuario(this.usuarioRecibido);

      return;
    }

    this.logger$.salidaPantalla(
      'ERR',
      'buscarUsuarioComponent',
      'ngOnchanges -> Usuario recibido NO válido'
    );

  }

  inicializaEntorno() {
    this.usuarioToolTip = null; // Sin usuario en el ToolTip
    this.usuarioToolTipClass = 'usuarioErrorTT';
    this.colorTexto = 'textoRojo';
  }

  onUsuario(evento: any) {
    // Evitamos que el evento se propague.
    evento.stopPropagation();

    const usuarioInput = evento.target.value;

    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioComponent',
      `Hemos llegado a usuarioPulsado() -> Usuario: ${usuarioInput}`
    );

    if (!usuarioInput) {
      this.logger$.salidaPantalla(
        'SEG',
        'buscarUsuarioComponent',
        'usuarioPulsado() - > La longitud es nula -> Abrimos diálogo'
      );
      this.abrirUsuarioDialog();
      return;
    }

    if (usuarioInput) {
      this.logger$.salidaPantalla(
        'SEG',
        'buscarUsuarioComponent',
        'usuarioPulsado() - > La longitud es NO nula -> Comprobamos longitud'
      );

      if (usuarioInput.length === 7 || usuarioInput.length === 8) {
        this.logger$.salidaPantalla(
          'SEG',
          'buscarUsuarioComponent',
          `usuarioPulsado() - > Longitud DENTRO de Rango -> compruebaUsuario(${usuarioInput})`
        );
        this.compruebaUsuario(usuarioInput);
      } else {
        this.logger$.salidaPantalla(
          'INFO',
          'buscarUsuarioComponent',
          'usuarioPulsado() - > La longitud FUERA de Rango -> Error'
        );
        this.configuraToolTip(true, 'Longitud no correcta');
      }
      return;
    }
  }

  compruebaUsuario(usuario: string) {
    this.logger$.salidaPantalla(
      'INFO',
      'buscarUsuarioComponent',
      `Estamos en compruebaUsuario(${usuario})`
    );

    this.usuario$
      .obtenerUsuarios(usuario)
      .subscribe((respuesta: RespuestaUsuario) => {
        if (!respuesta) {
          this.logger$.salidaPantalla(
            'ERR',
            'buscarUsuarioComponent',
            `compruebaUsuario -> No se ha obtenido respuesta`
          );
          return;
        }

        this.logger$.salidaPantalla(
          'INFO',
          'buscarUsuarioComponent',
          `compruebaUsuario -> Respuesta: ${JSON.stringify(respuesta)}`
        );

        if (!respuesta.usuarios) {
          this.logger$.salidaPantalla(
            'SEG',
            'buscarUsuarioComponent',
            `compruebaUsuario -> No se ha recuperado usuario`
          );

          this.configuraToolTip(true, 'No existe Usuario');

          return;
        }

        this.logger$.salidaPantalla(
          'SEG',
          'buscarUsuarioComponent',
          `compruebaUsuario -> Recuperado Usuario -> ${respuesta.usuarios[0].apellidos}, ${respuesta.usuarios[0].nombre}`
        );

        this.configuraToolTip(
          false,
          `${respuesta.usuarios[0].apellidos}, ${respuesta.usuarios[0].nombre}`
        );
        this.envioInformacion(respuesta.usuarios[0].usuario);

        return;
      });
  }

  configuraToolTip(error: boolean, texto: string) {
    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioComponent',
      `LLegamos a configuraToolTip(Error: ${error}, Texto: ${texto})`
    );

    if (error) {
      this.usuarioToolTip = `${texto}`; // Cambiamos el texto del tooltip
      this.usuarioToolTipClass = 'usuarioErrorTT';
      this.colorTexto = 'textoRojo';

      return;
    }

    this.usuarioToolTip = `${texto}`; // Cambiamos el texto del tooltip
    this.usuarioToolTipClass = 'usuarioTT';
    this.colorTexto = 'textoNegro';

    return;
  }

  /*************************************************************************************************
   ************************************** Diálogo **************************************************
   *************************************************************************************************/

  abrirUsuarioDialog() {
    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioComponent',
      'Estamos en abrirModeloDialog()'
    );

    const buscarUsuarioDialogConfig = new MatDialogConfig();
    buscarUsuarioDialogConfig.disableClose = false; // Permite cerrar la ventana con ESC
    buscarUsuarioDialogConfig.autoFocus = false;
    buscarUsuarioDialogConfig.data = { principal: 'Informática' };

    const buscarUsuarioDialogRef = this.BuscarUsuarioDialog.open(
      BuscarUsuarioDialogComponent,
      buscarUsuarioDialogConfig
    );

    // Recogemos el valor enviado por el modal
    buscarUsuarioDialogRef.afterClosed().subscribe((usuario: Usuario) => {
      this.logger$.salidaPantalla(
        'SEG',
        'buscarUsuarioComponent',
        `Recuperamos Información del Diálogo -> ${JSON.stringify(usuario)}`
      );

      if (usuario) {
        this.usuario = usuario.usuario;
        this.configuraToolTip(false, `${usuario.apellidos}, ${usuario.nombre}`);
        this.envioInformacion(usuario.usuario);
        return;
      }

      this.usuario = null;

    });
  }

  /*************************************************************************************************
   *************************** Enviamos Usuario al Padre *******************************************
   *************************************************************************************************/
  envioInformacion(usuario: string) {
    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioComponent',
      `envioInformacion() -> Vamos a enviar el usuario: ${usuario}`
    );

    this.enviarUsuarioEvent.emit(usuario);
  }
}

