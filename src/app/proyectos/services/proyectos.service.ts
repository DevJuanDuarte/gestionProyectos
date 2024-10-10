import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Proyecto } from '../interfaces/proyecto.interface';
import { environments } from 'src/app/environments/environments.prod';

@Injectable({ providedIn: 'root' })
export class ProyectosService {

  private baseUrl: string = environments.baseUrl;
  private localStorageKey = 'proyectos_local';

  constructor(private httpClient: HttpClient) { }

  getLocalProjects(): Proyecto[] {
    const proyectos = localStorage.getItem(this.localStorageKey);
    return proyectos ? JSON.parse(proyectos) : [];
  }

  saveLocalProjects(proyectos: Proyecto[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(proyectos));
  }

  getProyectos(): Observable<Proyecto[]> {
    const localProyectos = this.getLocalProjects();
    return this.httpClient.get<Proyecto[]>(`${this.baseUrl}/users`).pipe(
      map(proyectos => {
        // Combina los proyectos de JSONPlaceholder con los locales
        const updateProyectos = proyectos.map(proyecto => {
          const localProyecto = localProyectos.find(p => p.id === proyecto.id);
          return localProyecto ? localProyecto : proyecto;
        });
        return [...updateProyectos, ...localProyectos.filter(p => p.id > 10)]; // Excluye duplicados
      })
    );
  }
  

  getProyectoById(id: string): Observable<Proyecto | undefined> {
    const localProyectos = this.getLocalProjects();
    const localProyecto = localProyectos.find(p => p.id === parseInt(id, 10));
    if (localProyecto) {
      return of(localProyecto);
    }
    return this.httpClient.get<Proyecto>(`${this.baseUrl}/users/${id}`)
      .pipe(
        catchError(() => of(undefined))
      );
  }

  addProyecto(proyecto: Proyecto): Observable<Proyecto> {
    const localProyectos = this.getLocalProjects();
    const ultLocalId = localProyectos.length ? Math.max(...localProyectos.map(p => p.id)) : 0;
    const ultApiId = 10; // El último ID de JSONPlaceholder
    const newId = Math.max(ultLocalId, ultApiId) + 1;
    const newProyecto = { ...proyecto, id: newId };
    localProyectos.push(newProyecto);
    this.saveLocalProjects(localProyectos);
    return of(newProyecto); // Simula la creación exitosa
  }

  updateProyecto(proyecto: Proyecto): Observable<Proyecto> {
    const localProyectos = this.getLocalProjects();
    const index = localProyectos.findIndex(p => p.id === proyecto.id);
    if (index !== -1) {
      localProyectos[index] = proyecto;
      this.saveLocalProjects(localProyectos);
      console.log('actualizado desde local');
      return of(proyecto);
    } else {
      return this.httpClient.patch<Proyecto>(`${this.baseUrl}/users/${proyecto.id}`, proyecto)
        .pipe(
          map(updatedProject => {
            console.log('actualizado desde placeholder');
            // Agrega la lógica para actualizar el almacenamiento local.
            this.updateLocalProject(updatedProject);
            return updatedProject;
          }),
          catchError(err => {
            console.error('Error al actualizar el proyecto de JSONPlaceholder', err);
            return of(proyecto);
          })
        );
    }
  }
  
  // Método auxiliar para actualizar el proyecto en Local Storage
  updateLocalProject(updatedProject: Proyecto): void {
    const localProyectos = this.getLocalProjects();
    const index = localProyectos.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      localProyectos[index] = updatedProject;
    } else {
      localProyectos.push(updatedProject);
    }
    this.saveLocalProjects(localProyectos);
  }



  deleteProyecto(id: number): Observable<void> {
    const localProyectos = this.getLocalProjects();
    const index = localProyectos.findIndex(p => p.id === id);
    if (index !== -1) {
      localProyectos.splice(index, 1);
      this.saveLocalProjects(localProyectos);
      console.log('Desde local eliminando');
      return of();
    } else {
      return this.httpClient.delete<void>(`${this.baseUrl}/users/${id}`)
        .pipe(
          map(() => {
            console.log('Desde placeholder eliminando');
          }),
          catchError(err => {
            console.error('Error al eliminar el proyecto de JSONPlaceholder', err);
            return of();
          })
        );
    }
  }
  
}
