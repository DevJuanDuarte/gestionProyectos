import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/app/environments/environments';
import { Observable, of } from 'rxjs';
import { Tarea } from '../interfaces/tarea.interface';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TareasService {

  private baseUrl: string = environments.baseUrl;
  private localStorageKey = 'tareas_local';

  constructor(private httpClient: HttpClient) { }

  // Obtener tareas desde localStorage
  getLocalTareas(): Tarea[] {
    const tareas = localStorage.getItem(this.localStorageKey);
    return tareas ? JSON.parse(tareas) : [];
  }

  // Guardar tareas en localStorage
  saveLocalTareas(tareas: Tarea[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(tareas));
  }

  // Obtener todas las tareas (incluyendo locales)
  // getTareas(): Observable<Tarea[]> {
  //   const localTareas = this.getLocalTareas();
  //   return this.httpClient.get<Tarea[]>(`${this.baseUrl}/todos`).pipe(
  //     map(tareas => {
  //       // Filtrar las tareas locales para que no se dupliquen con las de JSONPlaceholder
  //       const updatedTareas = tareas.map(tarea => {
  //         const localTarea = localTareas.find(t => t.id === tarea.id);
  //         return localTarea ? localTarea : tarea;
  //       });
  //       // Incluir solo las tareas locales que no están en JSONPlaceholder
  //       return [...updatedTareas, ...localTareas.filter(t => t.id > 200)];
  //     })
  //   );
  // }

  getTareas(): Observable<Tarea[]> {
    const localTareas = this.getLocalTareas();
    return this.httpClient.get<Tarea[]>(`${this.baseUrl}/todos`).pipe(
      map(tareas => {
        const updatedTareas = tareas.map(tarea => {
          const localTarea = localTareas.find(t => t.id === tarea.id);
          return localTarea ? localTarea : tarea;
        });
        
        return [...updatedTareas, ...localTareas.filter(t => t.id > 200)].reverse();
      })
    );
  }
  
  // Obtener una tarea por ID
  getTareaById(id: string): Observable<Tarea | undefined> {
    const localTareas = this.getLocalTareas();
    const localTarea = localTareas.find(t => t.id === parseInt(id, 10));
    if (localTarea) {
      return of(localTarea);
    }
    return this.httpClient.get<Tarea>(`${this.baseUrl}/todos/${id}`)
      .pipe(
        catchError(() => of(undefined))
      );
  }

  // Crear una nueva tarea
  addTarea(tarea: Tarea): Observable<Tarea> {
    const localTareas = this.getLocalTareas();
    const lastLocalId = localTareas.length ? Math.max(...localTareas.map(t => t.id)) : 0;
    const newId = Math.max(200, lastLocalId) + 1;
    const newTarea = { ...tarea, id: newId };
    localTareas.push(newTarea);
    this.saveLocalTareas(localTareas);
    return of(newTarea);
  }

  // Actualizar una tarea existente
  updateTarea(tarea: Tarea): Observable<Tarea> {
    const localTareas = this.getLocalTareas();
    const index = localTareas.findIndex(t => t.id === tarea.id);
    if (index !== -1) {
      localTareas[index] = tarea;
      this.saveLocalTareas(localTareas);
      return of(tarea);
    } else {
      return this.httpClient.patch<Tarea>(`${this.baseUrl}/todos/${tarea.id}`, tarea)
        .pipe(
          map(updatedTarea => {
            this.updateLocalTarea(updatedTarea);
            return updatedTarea;
          }),
          catchError(err => {
            console.error('Error al actualizar la tarea', err);
            return of(tarea);
          })
        );
    }
  }

  // Actualizar tarea en localStorage
  private updateLocalTarea(updatedTarea: Tarea): void {
    const localTareas = this.getLocalTareas();
    const index = localTareas.findIndex(t => t.id === updatedTarea.id);
    if (index !== -1) {
      localTareas[index] = updatedTarea;
    } else {
      localTareas.push(updatedTarea);
    }
    this.saveLocalTareas(localTareas);
  }

  // Eliminar una tarea
  deleteTarea(id: number): Observable<void> {
    const localTareas = this.getLocalTareas();
    const index = localTareas.findIndex(t => t.id === id);
    if (index !== -1) {
      localTareas.splice(index, 1);
      this.saveLocalTareas(localTareas);
      return of();
    } else {
      return this.httpClient.delete<void>(`${this.baseUrl}/todos/${id}`)
        .pipe(
          map(() => {
            console.log('Tarea eliminada');
            this.deleteLocalTarea(id);
          }),
          catchError(err => {
            console.error('Error al eliminar la tarea', err);
            return of();
          })
        );
    }
  }

  // Método auxiliar para eliminar la tarea en localStorage
  private deleteLocalTarea(id: number): void {
    const localTareas = this.getLocalTareas();
    const index = localTareas.findIndex(t => t.id === id);
    if (index !== -1) {
      localTareas.splice(index, 1);
      this.saveLocalTareas(localTareas);
    }
  }
}
