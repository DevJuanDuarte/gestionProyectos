import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Proyecto } from '../interfaces/proyecto.interface';
import { environments } from 'src/app/environments/environments.prod';

@Injectable({ providedIn: 'root' })
export class ProyectosService {

  private baseUrl: string = environments.baseUrl;
  private localProjects: Proyecto[] = [];

  constructor(private httpClient: HttpClient) { }

  getProyectos(): Observable<Proyecto[]> {
    return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/users`)
    .pipe(
      map((projects) => [...projects, ...this.localProjects])
    )
  }

  getProyectoById(id: string): Observable<Proyecto | undefined> {
    return this.httpClient.get<Proyecto>(`${this.baseUrl}/users/${id}`)
      .pipe(
        catchError(error => of(undefined))
      )
  }

  addProyecto(proyecto: Proyecto): Observable<Proyecto> {
    // return this.httpClient.post<Proyecto>(`${this.baseUrl}/users`, proyecto);
    this.localProjects.push(proyecto);
    return of(proyecto); // Simula la creación exitosa

  }

  updateProyecto(proyecto: Proyecto): Observable<Proyecto> {
    if(!proyecto.id) throw Error('El proyecto es requerido');
    // return this.httpClient.patch<Proyecto>(`${this.baseUrl}/users/${proyecto.id}`, proyecto);
    const index = this.localProjects.findIndex(p => p.id === proyecto.id);
    if (index !== -1) {
      this.localProjects[index] = proyecto;
    }
    return of(proyecto); // Simula la actualización exitosa

  }

  deleteProyectoById(id:string): Observable<boolean> {
    return this.httpClient.delete(`${this.baseUrl}/users/${id}`)
     .pipe(
        catchError(err => of(false)),
        map(resp => true)
      )
  }

}