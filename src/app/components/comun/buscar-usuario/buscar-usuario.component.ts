/*************************************************************************************************
************************************ Components **************************************************
**************************************************************************************************/
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BuscarUsuarioDialogComponent } from './../../comun/buscar-usuario-dialog/buscar-usuario-dialog.component';

/*************************************************************************************************
************************************ Servicios ***************************************************
**************************************************************************************************/
import { LoggerService } from './../../../services/logger.service';
import { UsuarioService } from './../../../services/usuario.service';

/*************************************************************************************************
************************************** Modelos ***************************************************
**************************************************************************************************/
import { Usuario } from './../../../models/usuario.model';

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
export class BuscarUsuarioComponent implements OnInit {
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

  inicializaEntorno() {
    this.usuarioToolTip = null; // Sin usuario en el ToolTip
    this.usuarioToolTipClass = 'usuarioErrorTT';
    this.colorTexto = 'textoRojo';
  }

  usuarioPulsado(evento: any) {
    const usuarioInput = evento.target.value;

    this.logger$.enviarMensajeConsola(
      'buscarUsuarioComponent',
      `Hemos llegado a usuarioPulsado() -> Usuario: ${usuarioInput}`
    );

    if (!usuarioInput) {
      this.logger$.enviarMensajeConsola(
        'buscarUsuarioComponent',
        'usuarioPulsado() - > La longitud es nula -> Abrimos diálogo'
      );
      this.abrirUsuarioDialog();
      return;
    }

    if (usuarioInput) {
      this.logger$.enviarMensajeConsola(
        'buscarUsuarioComponent',
        'usuarioPulsado() - > La longitud es NO nula -> Comprobamos longitud'
      );

      if (usuarioInput.length === 7 || usuarioInput.length === 8) {
        this.logger$.enviarMensajeConsola(
          'buscarUsuarioComponent',
          'usuarioPulsado() - > Longitud DENTRO de Rango -> Comprobamos usuario'
        );
        this.compruebaUsuario(usuarioInput);
      } else {
        this.logger$.enviarMensajeConsola(
          'buscarUsuarioComponent',
          'usuarioPulsado() - > La longitud FUERA de Rango -> Error'
        );
        this.configuraToolTip(true, 'Longitud no correcta');
      }
      return;
    }
  }

  compruebaUsuario(usuario: string) {
    this.logger$.enviarMensajeConsola(
      'buscarUsuarioComponent',
      `Estamos en compruebaUsuario(${usuario})`
    );
    this.usuario$.obtenerUsuarios(usuario).subscribe((respuesta: any) => {
      if (!respuesta.usuarios) {
        this.logger$.enviarMensajeConsola(
          'buscarUsuarioComponent',
          `No se ha recuperado usuario`
        );
        this.configuraToolTip(true, 'No existe Usuario');
        return;
      }
      if (respuesta.usuarios) {
        this.configuraToolTip(
          false,
          `${respuesta.usuarios[0].apellidos}, ${respuesta.usuarios[0].nombre}`
        );
        this.envioInformacion(respuesta.usuarios[0].usuario);
        return;
      }
    });
  }

  configuraToolTip(error: boolean, texto: string) {
    this.logger$.enviarMensajeConsola(
      'buscarUsuarioComponent',
      `LLegamos configuraToolTip(Error: ${error}, Texto: ${texto})`
    );
    if (error) {
      this.usuarioToolTip = `${texto}`; // Cambiamos el texto del tooltip
      this.usuarioToolTipClass = 'usuarioErrorTT';
      this.colorTexto = 'textoRojo';
    } else {
      this.usuarioToolTip = `${texto}`; // Cambiamos el texto del tooltip
      this.usuarioToolTipClass = 'usuarioTT';
      this.colorTexto = 'textoNegro';
    }
    return;
  }

  estableceUsuario(usuario?: string) {
    if (usuario) {
      this.logger$.enviarMensajeConsola(
        'buscarUsuarioComponent',
        `estableceUsuario -> Se ha recibido usuario: ${usuario}`
      );
      this.compruebaUsuario(usuario);
      return;
    }
    this.logger$.enviarMensajeConsola(
      'buscarUsuarioComponent',
      'estableceUsuario -> NO se ha recibido usuario -> Se va a resetear el usuario'
    );
    this.inicializaEntorno();
    this.usuario = null;
  }
  /*************************************************************************************************
   ************************************** Diálogo **************************************************
   *************************************************************************************************/

  abrirUsuarioDialog() {
    this.logger$.enviarMensajeConsola(
      'buscarUsuarioComponent',
      'Estamos en abrirModeloDialog'
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
      this.logger$.enviarMensajeConsola(
        'buscarUsuarioComponent',
        `Recueperamos Información del Diálogo -> ${JSON.stringify(usuario)}`
      );

      this.usuario = usuario.usuario;
      this.configuraToolTip(false, `${usuario.apellidos}, ${usuario.nombre}`);
      this.envioInformacion(usuario.usuario);
    });
  }

  /*************************************************************************************************
   *************************** Enviamos Usuario al Padre *******************************************
   *************************************************************************************************/
  envioInformacion(usuario: string) {
    this.logger$.enviarMensajeConsola(
      'buscarUsuarioComponent',
      'envioInformacion() -> Ya tenemos usuario'
    );

    this.logger$.enviarMensajeConsola(
      'buscarUsuarioComponent',
      `envioInformacion() -> Vamos a enviar el usuario: ${usuario}`
    );

    this.enviarUsuarioEvent.emit(usuario);
  }
}

