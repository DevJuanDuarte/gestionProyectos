import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Tarea } from 'src/app/proyectos/interfaces/tarea.interface';
import { TareasService } from 'src/app/proyectos/services/tareas.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit, AfterViewInit {

  //Paginador
  public dataSource = new MatTableDataSource<Tarea>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  //Columnas a mostrar en la tabla
  displayedColumns: string[] = ['id', 'title', 'completed', 'actions'];


  constructor(private tareasService: TareasService) { }

  ngOnInit(): void {
    //Carga las tareas desde el inicio
    this.loadTasks();
  }

 
  //Metodo para cargar las tareas
  loadTasks(): void {
    this.tareasService.getTareas()
      .subscribe(tareas => {
        this.dataSource.data = tareas;
        console.log(this.dataSource.data);
      });
  }
}
