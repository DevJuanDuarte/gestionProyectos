import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { ProyectosRoutingModule } from './proyectos-routing.module';
import { ProyectoPageComponent } from './pages/proyecto-page/proyecto-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ProyectoCardComponent } from './components/proyecto-card/proyecto-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    ProyectoPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    NewPageComponent,
    ProyectoCardComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ProyectosRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ProyectosModule { }
