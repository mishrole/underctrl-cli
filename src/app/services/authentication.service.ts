import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from '../core/constants';
import { MenuItem } from '../models/menu-item';
import { LoginRequest } from '../models/request/login.request';
import { BaseResponse } from '../models/response/base.response';
import { LoginResponse } from '../models/response/login.response';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) { }

  oauth(loginRequest: LoginRequest): Observable<LoginResponse> {

    const params = new URLSearchParams();
    params.append("grant_type", loginRequest.grant_type);
    params.append("password", loginRequest.password);
    params.append("username", loginRequest.username);

    let headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${Constants.API_USER}:${Constants.API_PWD}`),
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
    });

    return this.http.post<LoginResponse>(`${environment.api}/oauth/token`, params.toString(), {headers: headers});
  }

  saveSession(session: Session): void {
    session.authenticated = true;
    sessionStorage.setItem('auth', JSON.stringify(session));
  }

  logout(): void {
    sessionStorage.removeItem('auth');
  }

  getSession(): Session | undefined {
    if (!sessionStorage.getItem('auth')) {
      return;
    }
    return JSON.parse(sessionStorage.getItem('auth')!!) as Session;
  }

  menuItems: MenuItem[];

  loadMenuItems(user: any): MenuItem[] {

    // TODO: Get Menu by multiple roles
    const firstRole = user.roles[0];

    if (firstRole.id === Constants.ROLE_ADMIN) {
      this.menuItems = [
        {name: 'Home', url: '/home', icon: 'bx-home-alt'},
        {name: 'Users', url: '/users', icon: 'bx-user'},
        {name: 'Accounts', url: '/accounts', icon: 'bx-wallet'},
        {name: 'Records', url: '/records', icon: 'bx-list-ul'},
        {name: 'Spending', url: '/spending', icon: 'bxs-doughnut-chart'},
        {name: 'Categories', url: '/categories', icon: 'bx-category-alt'},
        {name: 'Contacts', url: '/contacts', icon: 'bxs-contact'}
      ]
    }

    if (firstRole.id === Constants.ROLE_USER) {
      this.menuItems = [
        {name: 'Home', url: '/home', icon: 'bx-home-alt'},
        {name: 'Accounts', url: '/accounts', icon: 'bx-wallet'},
        {name: 'Records', url: '/records', icon: 'bx-list-ul'},
        {name: 'Spending', url: '/spending', icon: 'bxs-doughnut-chart'},
        {name: 'Categories', url: '/categories', icon: 'bx-category-alt'},
        {name: 'Contacts', url: '/contacts', icon: 'bxs-contact'}
      ]
    }

    return this.menuItems;
  }

}
