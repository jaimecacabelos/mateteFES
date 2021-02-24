// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// ************************************************************************************************
// *********************************** Modelos ****************************************************
// ************************************************************************************************
import { Usuario } from './../../../Tipado/usuario';

// ************************************************************************************************
// *********************************** Servicios **************************************************
// ************************************************************************************************
import { LoggerService } from './../../../services/logger.service';
import { UsuarioService } from './../../../services/usuario.service';
// ************************************************************************************************
// ********************************** Variables Globales ******************************************
// ************************************************************************************************
import { CELDAS } from './../../../config/entorno';
import { MAX_CODUSU, MIN_CODUSU } from './../../../config/entorno';

@Component({
  selector: 'app-buscar-usuario-dialog',
  templateUrl: './buscar-usuario-dialog.component.html',
  styleUrls: ['./buscar-usuario-dialog.component.css'],
})
export class BuscarUsuarioDialogComponent implements OnInit {
  buscarUsuarioForm: FormGroup;
  usuarioPrincipal = new FormControl(null);
  usuarioGrupo = new FormControl(null);
  usuarioApellidos = new FormControl(null, Validators.minLength(3));
  usuarioNombre = new FormControl(null, Validators.minLength(3));
  usuarioClave = new FormControl(null, [
    Validators.minLength(MIN_CODUSU),
    Validators.maxLength(MAX_CODUSU),
  ]);

  estiloCelda: string;
  principalMaestro: [{ nombre: string }];
  grupoMaestro: [
    {
      codigo: string;
      nombre: string;
    }
  ];

  errorUsuario: boolean;
  usuariosTabla: Usuario[];
  usuarioSeleccionado: Usuario;

  mostrarColumnas = ['apellidos', 'nombre', 'usuario'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private logger$: LoggerService,
    private usuario$: UsuarioService,
    private fb: FormBuilder,
    private buscarUsuarioDialogRef: MatDialogRef<BuscarUsuarioDialogComponent>
  ) {
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  construirFormulario() {
    this.buscarUsuarioForm = this.fb.group({
      usuarioPrincipal: this.usuarioPrincipal,
      usuarioGrupo: this.usuarioGrupo,
      usuarioApellidos: this.usuarioApellidos,
      usuarioNombre: this.usuarioNombre,
      usuarioClave: this.usuarioClave,
    });
  }

  inicializarFormulario() {
    this.usuariosTabla = null;
    this.usuarioSeleccionado = null;
    this.errorUsuario = false;

    if (this.data.principal) {
      this.buscarUsuarioForm
        .get('usuarioPrincipal')
        .setValue(this.data.principal);
      this.poblarGrupos(this.data.principal);
      return;
    }
    this.poblarPrincipal();
  }

  poblarPrincipal() {
    this.logger$.enviarMensajeConsola('buscarUsuarioDialog', `poblarPrincipal`);

    this.usuario$.obtenerPrincipal().subscribe((respuesta: any) => {
      this.principalMaestro = respuesta.puestos;
    });
  }

  poblarGrupos(principal: string) {
    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioDialog',
      `poblarGrupos -> ${principal}`
    );

    this.usuario$.obtenerGrupos(principal).subscribe((respuesta: any) => {
      this.grupoMaestro = respuesta.puestos;
    });
  }

  // ************** Eventos de los controles **********************************
  apellidosEnter(evento: any) {
    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioDialog',
      `apellidosEnter() -> Apellido: ${evento.target.value}`
    );

    this.realizarConsulta();
  }

  nombreEnter(evento: any) {
    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioDialog',
      `nombreEnter() -> Nombre: ${evento.target.value}`
    );

    this.realizarConsulta();
  }

  claveEnter(evento: any) {
    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioDialog',
      `claveEnter() -> Clave: ${evento.target.value}`
    );

    this.realizarConsulta();
  }

  // ********************* Realizamos la Consulta ****************************
  realizarConsulta() {
    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioComponent',
      `Estado del formulario -> ${this.buscarUsuarioForm.valid}`
    );

    if (
      !this.buscarUsuarioForm.get('usuarioClave').value &&
      !this.buscarUsuarioForm.get('usuarioGrupo').value &&
      !this.buscarUsuarioForm.get('usuarioApellidos').value &&
      !this.buscarUsuarioForm.get('usuarioNombre').value
    ) {
      this.logger$.salidaPantalla(
        'SEG',
        'buscarUsuarioDialog',
        'No se puede realiza la consulta ya que no se han enviado datos'
      );
      return;
    }

    if (this.buscarUsuarioForm.valid) {
      this.usuario$
        .obtenerUsuarios(
          this.buscarUsuarioForm.get('usuarioClave').value,
          this.buscarUsuarioForm.get('usuarioGrupo').value,
          this.buscarUsuarioForm.get('usuarioApellidos').value,
          this.buscarUsuarioForm.get('usuarioNombre').value
        )
        .subscribe((respuesta: any) => {
          if (!respuesta) {
            this.logger$.salidaPantalla(
              'INFO',
              'buscarUsuarioComponent',
              `Respuesta nula`
            );
          }

          this.usuariosDevueltos(respuesta.usuarios);
        });
      return;
    }

    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioComponent',
      'No se realiza consulta ya que le formulario es INVÁLIDO'
    );
  }
  // ********************* Recuperamos Usuarios ****************************
  usuariosDevueltos(usuarios: Usuario[]) {
    this.errorUsuario = false;

    if (!usuarios) {
      this.logger$.salidaPantalla(
        'INFO',
        'buscarUsuarioDialog',
        'No se han enviado usuarios -> Mensaje sin Usuarios'
      );
      this.errorUsuario = true;
      return;
    }

    if (usuarios.length === 1) {
      this.logger$.salidaPantalla(
        'SEG',
        'buscarUsuarioDialog',
        `Se ha enviado un usuario -> Cargar los datos de los controles del formulario
          -> ${JSON.stringify(usuarios[0])}`
      );

      this.buscarUsuarioForm
        .get('usuarioApellidos')
        .setValue(usuarios[0].apellidos);
      this.buscarUsuarioForm.get('usuarioNombre').setValue(usuarios[0].nombre);

      this.buscarUsuarioForm.get('usuarioClave').setValue(usuarios[0].usuario);

      this.usuarioSeleccionado = usuarios[0];

      return;
    }

    if (usuarios.length > 1) {
      this.logger$.salidaPantalla(
        'SEG',
        'buscarUsuarioDialog',
        `Se han devuelto ${usuarios.length} usuarios -> Cargar la tabla`
      );
      this.usuariosTabla = usuarios;
      return;
    }
  }

  // ***************** Recuperamos la información de la fila de la tabla ********************************
  valorPulsado(usuarioPulsado: Usuario) {
    this.logger$.salidaPantalla(
      'INFO',
      'buscarUsuarioDialog',
      `Usuario Devuelto -> ${usuarioPulsado}`
    );
    this.usuarioSeleccionado = usuarioPulsado;
    this.finalizar();
  }

  // ********************* Enviamos el usuario seleccionado *********************************************
  finalizar() {
    if (this.usuarioSeleccionado) {
      this.logger$.salidaPantalla(
        'SEG',
        'buscarUsuarioDialog',
        'Se ha pulsado ACEPTAR -> Cerramos modal y enviamos usuario'
      );

      this.buscarUsuarioDialogRef.close(this.usuarioSeleccionado);

      return;
    }

    this.logger$.salidaPantalla(
      'INFO',
      'buscarUsuarioDialog',
      'Se ha pulsado ACEPTAR -> NO cerramos modal ya que no tenemos usuario'
    );
  }

  nueva() {
    this.logger$.salidaPantalla(
      'SEG',
      'buscarUsuarioDialog',
      'Se ha pulsado NUEVA -> Se va a resetear el formulario'
    );

    this.buscarUsuarioForm.reset();
    this.inicializarFormulario();
  }
}
