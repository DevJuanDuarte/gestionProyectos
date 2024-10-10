import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/app/environments/environments';
import { User } from '../interfaces/auth.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  
  private baseUrl = environments.proyectosUrl;
  private user?: User;
  
  constructor(private httpClient: HttpClient) { }

  get currentUser():User|undefined {
    if(!this.user) return undefined;
    return structuredClone(this.user); //Para clonar el objeto
  }

  login(email:string, password:string): Observable<User>{
    return this.httpClient.get<User>(`${this.baseUrl}/1`)
    .pipe(
      tap(user => {
        this.user = user;
        localStorage.setItem('token', 'AasJKLjnan.msdsdahsjdhasbn2131$@#$.@#$asdasd@#!!@#')
      })
    );

  }

  checkAutenticacion():Observable<boolean>{
    if(!localStorage.getItem('token')) return of(false);
    const token = localStorage.getItem('token');
    return this.httpClient.get<User>(`${this.baseUrl}/1`)
    .pipe(
      tap( user => this.user = user),
      map( user => !!user),
      catchError(err => of(false))
    )
  }

  logOut(){
    this.user = undefined;
    localStorage.clear();
  }
}