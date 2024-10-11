import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

//Guard para autenticacion
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch, CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  //Metodo para validar la autenticacion
  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAutenticacion()
      .pipe(
        tap(isAutenticado => {
          if (!isAutenticado) {
            //Si no esta autenticado lo redirije al login
            this.router.navigate(['/auth/login']);
          }
        })
      )
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    // console.log('Can match');
    // console.log({route, segments});
    // return true;
    return this.checkAuthStatus();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log('Can activate');
    // console.log({route, state});
    // return true;
    return this.checkAuthStatus();

  }

}