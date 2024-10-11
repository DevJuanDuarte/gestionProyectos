import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/interfaces/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent {

  constructor(
    private authService: AuthService,
    private router: Router

  ) {

  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigate(['/auth/login']);
  }

  get user(): User | undefined {
    return this.authService.currentUser;
  }




  public sidebarItems = [
    { label: 'Proyectos', icon: 'label', url: '/proyectos/list' },
    { label: 'Tareas', icon: 'library_books', url: '/tareas/list' }, // Ruta correcta para listar tareas
    // { label: 'Crear Proyecto', icon: 'create_new_folder', url: '/proyectos/new-project' },
    // { label: 'Crear Tarea', icon: 'task', url: '/tareas/new-task' }, // Ruta correcta para crear tarea
  ];


}
