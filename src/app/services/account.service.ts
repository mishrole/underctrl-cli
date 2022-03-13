import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/response/base.response';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) { }

  allAccountsByOwner(id: number): Observable<BaseResponse<any>> {
    return this.http.get<any>(`${environment.api}/api/v1/accounts/owner/${id}`, {headers: this.authService.getHeaderBearerToken()});
  }

  getAccountById(id: number): Observable<BaseResponse<any>> {
    return this.http.get<any>(`${environment.api}/api/v1/accounts/${id}`, {headers: this.authService.getHeaderBearerToken()});
  }

  save(account: any): Observable<BaseResponse<any>> {
    return this.http.post<any>(`${environment.api}/api/v1/accounts/`, account, this.authService.getHttpOptions('application/json'));
  }

  update(id: number, account: any): Observable<BaseResponse<any>> {
    return this.http.put<any>(`${environment.api}/api/v1/accounts/${id}`, account, this.authService.getHttpOptions('application/json'));
  }

  delete(id: number): Observable<BaseResponse<any>> {
    return this.http.delete<any>(`${environment.api}/api/v1/accounts/${id}`, {headers: this.authService.getHeaderBearerToken()});
  }
}
