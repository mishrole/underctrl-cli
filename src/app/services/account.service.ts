import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/response/base.response';
import { Session } from '../models/session';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) { }

  token = this.authService.getSession()?.access_token;
  
  allAccountsByOwner(id: number): Observable<BaseResponse<any>> {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<any>(`${environment.api}/api/v1/accounts/owner/${id}`, {headers: headers});
  }
}