import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { LoginRequest } from 'src/app/models/request/login.request';
import { RefreshTokenRequest } from 'src/app/models/request/refresh-token.request';
import { LoginResponse } from 'src/app/models/response/login.response';
import { Role } from 'src/app/models/role';
import { Session } from 'src/app/models/session';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Constants } from '../constants';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  // Only Executes on HttpClient call
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const session = this.authService.getSession();
    const token: string = session?.access_token as string;

    console.log('previous session', session);

    let authReq = req;

    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401) {
          console.warn('catch 401, handler starts')
          // if (error.error.error_description.includes("Invalid refresh token") || error.error.error.includes('invalid_token')) {
          if (error.error.error_description.includes("Invalid refresh token")) {
            console.error('Refresh token error', error);
            this.logoutRedirect();
            return throwError(new Error("Session expired. Please sign in"));
          } else if (error.error.error_description.includes("Access token expired")) {
            return this.handle401Error(authReq, next);
          } else {
            console.error("401 Error different to Access token expired & Invalid refresh token", error);
            this.logoutRedirect();
            return throwError(new Error("Unexpected error"));
          }
        } else {
          console.warn('catch another error status, different to 401', error);
          if (error.status === 0) {
            console.error("Error Status 0")
            this.logoutRedirect();
            return throwError(new Error("Unexpected error"));
          }
          return throwError(error);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const session = this.authService.getSession();

      const refreshTokenRequest = new RefreshTokenRequest();
      refreshTokenRequest.grant_type = Constants.GRANT_TYPE_REFRESH;
      refreshTokenRequest.refresh_token = session?.refresh_token || '';

      if (refreshTokenRequest) {
        return this.authService.refreshToken(refreshTokenRequest).pipe(
          switchMap((tokenResponse: any) => {
            this.isRefreshing = false;

            const user = new User();
            const roles : Role[] = [];
            
            for (let item of tokenResponse?.roles) {
              const role = new Role();
              role.id = item.id;
              role.name = item.name;
              roles.push(role);
            }
            
            user.roles = roles;
            
            user.id = tokenResponse?.id;
            user.firstname = tokenResponse?.firstname ||'';
            user.lastname = tokenResponse?.lastname || '';
            user.email = tokenResponse?.email || '';
            const session = new Session(tokenResponse?.access_token, tokenResponse?.refresh_token, user);
            this.authService.saveSession(session);
            console.warn('NEW SESSION:', session);

            this.refreshTokenSubject.next(session.access_token);

            return next.handle(this.addTokenHeader(request, tokenResponse.access_token));
            
          }),
          catchError((err) => {
            console.warn('switchMap catchError', err);
            this.isRefreshing = false;
            this.logoutRedirect();
            // TODO: Check if throwError is called
            return throwError(new Error("Session expired. Failed to refresh token. Please, sign in"));
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
  }

  private logoutRedirect(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
