import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TareasRoutingModule } from './tareas-routing.module';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NewPageComponent,
    ListPageComponent
  ],
  imports: [
    CommonModule,
    TareasRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class TareasModule { }
