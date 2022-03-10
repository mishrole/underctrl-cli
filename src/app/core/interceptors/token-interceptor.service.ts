import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { LoginRequest } from 'src/app/models/request/login.request';
import { RefreshTokenRequest } from 'src/app/models/request/refresh-token.request';
import { LoginResponse } from 'src/app/models/response/login.response';
import { Role } from 'src/app/models/role';
import { Session } from 'src/app/models/session';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Constants } from '../constants';
import { catchError, concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  // Executes only on HttpClient call
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const session = this.authService.getSession();
    const token: string = session?.access_token as string;

    if (token) {
      req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401) {

          const refreshTokenRequest = new RefreshTokenRequest();
          refreshTokenRequest.grant_type = Constants.GRANT_TYPE_REFRESH;
          refreshTokenRequest.refresh_token = session?.refresh_token || '';

          return this.authService.refreshToken(refreshTokenRequest).pipe(
            concatMap((res: any) => {
              const user = new User();

              const roles : Role[] = [];
              
              for (let item of res?.roles) {
                const role = new Role();
                role.id = item.id;
                role.name = item.name;
                roles.push(role);
              }
              
              user.roles = roles;
    
              user.firstname = res?.firstname ||'';
              user.lastname = res?.lastname || '';
              user.email = res?.email || '';
              const session = new Session(res?.access_token, res?.refresh_token, user);
              this.authService.saveSession(session)

              const checkSession = this.authService.getSession();
              console.log('New session: ', checkSession);

              const token: string = checkSession?.access_token as string;

              if (token) {
                req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
              }

              return next.handle(req);
            }),
            catchError((error: HttpErrorResponse) => {
              console.warn('Token refrsh error: ', error);
              this.authService.logout();
              const session = this.authService.getSession();
              if (!session) {
                this.router.navigate(['/auth']);
              }

              return throwError(error);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}
