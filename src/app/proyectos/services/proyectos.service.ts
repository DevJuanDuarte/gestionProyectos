import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Proyecto } from '../interfaces/proyecto.interface';
import { environments } from 'src/app/environments/environments.prod';

@Injectable({ providedIn: 'root' })
export class ProyectosService {

  private baseUrl: string = environments.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getProyectos(): Observable<Proyecto[]> {
    return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/users`);
  }

  getProyectoById(id: string): Observable<Proyecto | undefined> {
    return this.httpClient.get<Proyecto>(`${this.baseUrl}/users/${id}`)
      .pipe(
        catchError(error => of(undefined))
      )
  }

}