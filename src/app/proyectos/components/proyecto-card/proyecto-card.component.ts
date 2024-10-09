import { Component, Input, OnInit } from '@angular/core';
import { Proyecto } from '../../interfaces/proyecto.interface';

@Component({
  selector: 'app-proyecto-card',
  templateUrl: './proyecto-card.component.html',
  styleUrls: ['./proyecto-card.component.css']
})
export class ProyectoCardComponent implements OnInit {
  
  @Input()
  public proyecto!: Proyecto
  ngOnInit(): void {
    if (!this.proyecto) throw Error('El proyecto es requerido')
  }
}
