import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/app/environments/environments.prod';
import { Observable } from 'rxjs';
import { Tarea } from '../interfaces/tarea.interface';

@Injectable({providedIn: 'root'})
export class TareasService {

  private baseUrl: string = environments.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getTareas(): Observable<Tarea[]> {
    return this.httpClient.get<Tarea[]>(`${this.baseUrl}/todos`);
  }
  
}