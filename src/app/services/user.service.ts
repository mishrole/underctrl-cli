import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/response/base.response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient
  ) { }

  register(user: User): Observable<BaseResponse<User>> {
    return this.http.post<BaseResponse<User>>(`${environment.api}/api/v1/users/register`, user, this.httpOptions);
  }

  update(id: number, user: User): Observable<BaseResponse<User>> {
    return this.http.put<BaseResponse<User>>(`${environment.api}/api/v1/users/${id}`, user, this.httpOptions);
  }

  findById(id: number): Observable<BaseResponse<User>> {
    return this.http.get<BaseResponse<User>>(`${environment.api}/api/v1/users/${id}`);
  }
}
