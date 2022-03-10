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

    // Executes only on HttpClient call

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const session = this.authService.getSession();
    const token: string = session?.access_token as string;

    console.log('previous session', session);

    let authReq = req;

    if (token != null) {
      // authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401) {
          return this.handle401Error(authReq, next);
        } else {
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

            this.refreshTokenSubject.next(session.access_token);

            return next.handle(this.addTokenHeader(request, tokenResponse.access_token));
            
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.authService.logout();
            this.router.navigate(['/auth']);
            return throwError(err);
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

  // refreshToken(refreshTokenRequest: RefreshTokenRequest) {
  //   this.authService.refreshToken(refreshTokenRequest).subscribe((res: any) => {
  //     console.warn('new refresh token', res);
  //     const user = new User();
  //     const roles : Role[] = [];
      
  //     for (let item of res?.roles) {
  //       const role = new Role();
  //       role.id = item.id;
  //       role.name = item.name;
  //       roles.push(role);
  //     }
      
  //     user.roles = roles;
      
  //     user.id = res?.id;
  //     user.firstname = res?.firstname ||'';
  //     user.lastname = res?.lastname || '';
  //     user.email = res?.email || '';
  //     const session = new Session(res?.access_token, res?.refresh_token, user);
  //     this.authService.saveSession(session);

  //   }, err => {
  //     console.warn(err);
  //     this.authService.logout();
  //     const session = this.authService.getSession();
  //     if (!session) {
  //       this.router.navigate(['/auth']);
  //     }
  //   });
  // }



      // catchError(error => {
      //   if (error && error.status === 401) {
      //     return this.handle401Error(authReq, next);
      //   }

      //   return throwError(error);
      // })


    // return next.handle(req).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if (error && error.status === 401) {

    //       if (!session) {
    //         this.authService.logout();
    //         this.router.navigate(['/auth']);
    //         return throwError(new Error('Failed to get new token'));
    //       }      

    //       const refreshTokenRequest = new RefreshTokenRequest();
    //       refreshTokenRequest.grant_type = Constants.GRANT_TYPE_REFRESH;
    //       refreshTokenRequest.refresh_token = session?.refresh_token || '';

    //       debugger;
    //       // console.log('token interceptor', refreshTokenRequest);

    //       // this.refreshToken(refreshTokenRequest);
    //       // const checkSession = this.authService.getSession();
    //       // const newToken: string = checkSession?.access_token as string;

    //       // if (newToken) {
    //       //   req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + newToken) });
    //       // }

    //       // return next.handle(req);

    //       return this.authService.refreshToken(refreshTokenRequest).pipe(
    //         switchMap((tokenResponse: any) => {
    //           console.warn(tokenResponse);

              
    //           const user = new User();

    //           const roles : Role[] = [];
              
    //           for (let item of tokenResponse?.roles) {
    //             const role = new Role();
    //             role.id = item.id;
    //             role.name = item.name;
    //             roles.push(role);
    //           }
              
    //           user.roles = roles;
              
    //           user.id = tokenResponse?.id;
    //           user.firstname = tokenResponse?.firstname ||'';
    //           user.lastname = tokenResponse?.lastname || '';
    //           user.email = tokenResponse?.email || '';
    //           const session = new Session(tokenResponse?.access_token, tokenResponse?.refresh_token, user);
    //           this.authService.saveSession(session);

    //                        const checkSession = this.authService.getSession();
    //           console.log('New session: ', checkSession);

    //           const newToken: string = checkSession?.access_token as string;

    //           if (newToken) {
    //             if (tokenResponse?.refresh_token != session?.refresh_token) {
    //               req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + newToken) });
    //             } else {
    //               return throwError(new Error('New refresh token is equals to previous refresh token'));
    //             }

                
    //           }

    //           return next.handle(req);
    //         }), // END CONCAT MAP
    //         catchError((error: HttpErrorResponse) => {
    //           console.warn('Token refresh error: ', error);
    //           this.authService.logout();
    //           const session = this.authService.getSession();
    //           if (!session) {
    //             this.router.navigate(['/auth']);
    //           }

    //           return throwError(error);

    //         }) // END CATCH ERROR
            
    //       );// END PIPE




    //       // return this.authService.refreshToken(refreshTokenRequest).pipe(
            
    //       //   concatMap((tokenRes: any) => {
    //       //     debugger;
    //       //     console.log('token pipe');
    //       //     console.log(tokenRes);
    //       //     const user = new User();

    //       //     const roles : Role[] = [];
              
    //       //     for (let item of tokenRes?.roles) {
    //       //       const role = new Role();
    //       //       role.id = item.id;
    //       //       role.name = item.name;
    //       //       roles.push(role);
    //       //     }
              
    //       //     user.roles = roles;
              
    //       //     user.id = tokenRes?.id;
    //       //     user.firstname = tokenRes?.firstname ||'';
    //       //     user.lastname = tokenRes?.lastname || '';
    //       //     user.email = tokenRes?.email || '';
    //       //     const session = new Session(tokenRes?.access_token, tokenRes?.refresh_token, user);
    //       //     this.authService.saveSession(session)

    //       //     const checkSession = this.authService.getSession();
    //       //     console.log('New session: ', checkSession);

    //       //     const token: string = checkSession?.access_token as string;

    //       //     if (token) {
    //       //       req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
    //       //     }

    //       //     return next.handle(req);
    //       //   }),
    //       //   catchError((error: HttpErrorResponse) => {
    //       //     console.warn('Token refresh error: ', error);
    //       //     this.authService.logout();
    //       //     const session = this.authService.getSession();
    //       //     if (!session) {
    //       //       this.router.navigate(['/auth']);
    //       //     }

    //       //     return throwError(error);
    //       //   })
    //       // );
    //     } else {
    //       // this.authService.logout();
    //       // const session = this.authService.getSession();
    //       // if (!session) {
    //       //   this.router.navigate(['/auth']);
    //       // }
    //       this.authService.logout();
    //       this.router.navigate(['/auth']);
    //       return throwError(error);
    //     }
    //   })
    // );
  // }
}
