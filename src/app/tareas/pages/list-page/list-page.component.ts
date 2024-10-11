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

  public dataSource = new MatTableDataSource<Tarea>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'title', 'completed', 'actions'];

  constructor(private tareasService: TareasService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadTasks(): void {
    this.tareasService.getTareas()
      .subscribe(tareas => {
        this.dataSource.data = tareas;
        console.log(this.dataSource.data);
      });
  }

  editTask(tarea: Tarea): void {
    // Implement your edit logic here
    console.log('Editar tarea:', tarea);
  }

  deleteTask(id: number): void {
    this.tareasService.deleteTarea(id)
      .subscribe(() => {
        this.loadTasks();
      });
  }
}
