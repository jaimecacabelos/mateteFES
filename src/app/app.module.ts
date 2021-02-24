// ************************************************************************************************
// ************************************* Módulos **************************************************
// ************************************************************************************************
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './modules/material/material.module';
import { NgModule } from '@angular/core';

// ************************************************************************************************
// *********************************** Components *************************************************
// ************************************************************************************************
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BuscarCentroDialogComponent } from './components/comun/buscar-centro-dialog/buscar-centro-dialog.component';
import { BuscarModeloDialogComponent } from './components/comun/buscar-modelo-dialog/buscar-modelo-dialog.component';
import { BuscarUsuarioComponent } from './components/comun/buscar-usuario/buscar-usuario.component';
import { BuscarUsuarioDialogComponent } from './components/comun/buscar-usuario-dialog/buscar-usuario-dialog.component';
import { DatosComponent } from './components/incidencia/datos/datos.component';
import { DiarioComponent } from './components/incidencia/diario/diario.component';
import { IncidenciaComponent } from './components/incidencia/incidencia.component';
import { IncidenciasDialogComponent } from './components/incidencia/incidencias-dialog/incidencias-dialog.component';
import { NumeroComponent } from './components/incidencia/numero/numero.component';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DispositivoComponent } from './components/incidencia/datos/components/dispositivo/dispositivo.component';
import { TipificacionComponent } from './components/incidencia/datos/components/tipificacion/tipificacion.component';
import { TipificacionDialogComponent } from './components/incidencia/datos/components/tipificacion/tipificacion-dialog/tipificacion-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BuscarCentroDialogComponent,
    BuscarModeloDialogComponent,
    BuscarUsuarioComponent,
    BuscarUsuarioDialogComponent,
    DatosComponent,
    DiarioComponent,
    IncidenciaComponent,
    IncidenciasDialogComponent,
    NumeroComponent,
    NumeroComponent,
    DispositivoComponent,
    TipificacionComponent,
    TipificacionDialogComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    // LoggerService,
    // IncidenciaService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
