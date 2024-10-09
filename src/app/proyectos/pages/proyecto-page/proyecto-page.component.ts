import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../services/proyectos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Proyecto } from '../../interfaces/proyecto.interface';
import { TareasService } from '../../services/tareas.service';
import { Tarea } from '../../interfaces/tarea.interface';

@Component({
  selector: 'app-proyecto-page',
  templateUrl: './proyecto-page.component.html',
  styleUrls: ['./proyecto-page.component.css']
})
export class ProyectoPageComponent implements OnInit {

  public proyecto?: Proyecto;
  public tareas: Tarea[] = [];

  constructor(
    private proyectosService: ProyectosService,
    private tareasService: TareasService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.proyectosService.getProyectoById(id))
      ).subscribe(proyecto => {
        if (!proyecto) return this.router.navigate(['/proyectos/list']);
        this.proyecto = proyecto;
        this.cargarTareas(proyecto.id);
        // console.log({proyecto});
        return;
      });
  }

  cargarTareas(userId: number): void {
    this.tareasService.getTareas().subscribe(tareas => {
      this.tareas = tareas.filter(tarea => tarea.userId === userId);
      // console.log(this.tareas);
    });
  }

}
