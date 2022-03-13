import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/response/base.response';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) { }

  allRecordsByAccount(id: number, filter: any): Observable<BaseResponse<any>> {
    let httpOptions = this.authService.getHttpOptionsWithParams('application/json', filter);
    return this.http.get<any>(`${environment.api}/api/v1/records/account/${id}/search`, httpOptions);
  }

  allRecordsByOwnerAndOrAccountAndFilters(id: number, filter: any): Observable<BaseResponse<any>> {
    let httpOptions = this.authService.getHttpOptionsWithParams('application/json', filter);
    return this.http.get<any>(`${environment.api}/api/v1/records/owner/${id}/search`, httpOptions);
  }

  save(record: any): Observable<BaseResponse<any>> {
    return this.http.post<any>(`${environment.api}/api/v1/records/`, record, this.authService.getHttpOptions('application/json'));
  }

  getRecordById(id: number): Observable<BaseResponse<any>> {
    return this.http.get<any>(`${environment.api}/api/v1/records/${id}`, {headers: this.authService.getHeaderBearerToken()});
  }

  update(id: number, record: any): Observable<BaseResponse<any>> {
    return this.http.put<any>(`${environment.api}/api/v1/records/${id}`, record, this.authService.getHttpOptions('application/json'));
  }

  delete(id: number): Observable<BaseResponse<any>> {
    return this.http.delete<any>(`${environment.api}/api/v1/records/${id}`, {headers: this.authService.getHeaderBearerToken()});
  }
  
}
