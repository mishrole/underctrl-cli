import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/response/base.response';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  register(user: User): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${environment.api}/api/v1/users/register`, user, this.httpOptions);
  }

  update(id: number, user: User): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(`${environment.api}/api/v1/users/${id}`, user, this.authService.getHttpOptions('application/json'));
  }

  findById(id: number): Observable<BaseResponse<any>> {
    return this.http.get<BaseResponse<any>>(`${environment.api}/api/v1/users/${id}`, {headers: this.authService.getHeaderBearerToken()});
  }
}
