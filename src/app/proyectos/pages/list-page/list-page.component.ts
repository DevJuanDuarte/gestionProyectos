import { Component, OnInit } from '@angular/core';
import { Proyecto } from '../../interfaces/proyecto.interface';
import { ProyectosService } from '../../services/proyectos.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit {

  public proyectos: Proyecto[] = [];

  constructor(private proyectosServices: ProyectosService) { }
  ngOnInit(): void {
    this.proyectosServices.getProyectos().subscribe(proyectos => this.proyectos = proyectos);
  }



}
