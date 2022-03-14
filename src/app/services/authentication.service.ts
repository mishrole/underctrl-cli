import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../core/constants';
import { MenuItem } from '../models/menu-item';
import { LoginRequest } from '../models/request/login.request';
import { RefreshTokenRequest } from '../models/request/refresh-token.request';
import { LoginResponse } from '../models/response/login.response';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) { }

  menuItems: MenuItem[];

  getHeaderBearerToken(): HttpHeaders {
    const token = this.getSession()?.access_token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return headers;
  }

  getHttpOptions(contentType: string): object {
    const token = this.getSession()?.access_token;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': contentType
      })
    };

    return httpOptions;
  }

  getHttpOptionsWithParams(contentType: string, filter: any): object {
    const token = this.getSession()?.access_token;

    let params = new HttpParams();

    for (const key in filter) {
      if ((filter[key] !== undefined) && (filter[key] !== null)) {
        params = params.append(key.toString(), filter[key]);
      }
    }

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': contentType
      }),
      params
    };

    return httpOptions;
  }

  oauth(loginRequest: LoginRequest): Observable<LoginResponse> {

    const params = new URLSearchParams();
    params.append('grant_type', loginRequest.grant_type);
    params.append('password', loginRequest.password);
    params.append('username', loginRequest.username);

    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${Constants.API_USER}:${Constants.API_PWD}`),
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    });

    return this.http.post<LoginResponse>(`${environment.api}/oauth/token`, params.toString(), {headers});
  }

  refreshToken(refreshTokenRequest: RefreshTokenRequest): Observable<any> {

    const params = new URLSearchParams();
    params.append('grant_type', refreshTokenRequest.grant_type);
    params.append('refresh_token', refreshTokenRequest.refresh_token);

    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${Constants.API_USER}:${Constants.API_PWD}`),
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    });

    return this.http.post<any>(`${environment.api}/oauth/token`, params.toString(), {headers});
  }

  saveSession(session: Session): void {
    session.authenticated = true;
    sessionStorage.setItem('auth', JSON.stringify(session));
  }

  logout(): void {
    sessionStorage.removeItem('auth');
  }

  getSession(): Session | undefined {

    const session = sessionStorage.getItem('auth');

    if (session != null) {
      return JSON.parse(session) as Session;
    }

    return;

  }

  loadMenuItems(user: any): MenuItem[] {

    // TODO: Get Menu by multiple roles
    const firstRole = user?.roles[0];

    if (firstRole) {
      if (firstRole.id === Constants.ROLE_ADMIN) {
        this.menuItems = [
          {name: 'Home', url: '/home', icon: 'bx-home-alt'},
          {name: 'Users', url: '/users', icon: 'bx-user'},
          {name: 'Accounts', url: '/accounts', icon: 'bx-wallet'},
          {name: 'Records', url: '/records', icon: 'bx-list-ul'},
          {name: 'Spending', url: '/spending', icon: 'bxs-doughnut-chart'},
          {name: 'Categories', url: '/categories', icon: 'bx-category-alt'},
          {name: 'Contacts', url: '/contacts', icon: 'bxs-contact'}
        ];
      }

      if (firstRole.id === Constants.ROLE_USER) {
        this.menuItems = [
          {name: 'Home', url: '/home', icon: 'bx-home-alt'},
          {name: 'Accounts', url: '/accounts', icon: 'bx-wallet'},
          {name: 'Records', url: '/records', icon: 'bx-list-ul'},
          // {name: 'Spending', url: '/spending', icon: 'bxs-doughnut-chart'},
          // {name: 'Categories', url: '/categories', icon: 'bx-category-alt'},
          {name: 'Contacts', url: '/contacts', icon: 'bxs-contact'}
        ];
      }
    }

    return this.menuItems;
  }

}
