import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent {

  public sidebarItems = [
    {label: 'Listado', icon: 'label', url: './list'},
    {label: 'Crear Proyecto', icon: 'create_new_folder', url: './new-project'},
    {label: 'Crear Tarea', icon: 'task', url: './new-project'},
  ]

}
