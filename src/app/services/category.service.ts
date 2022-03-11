import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/response/base.response';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) { }

  allCategories(): Observable<BaseResponse<any>> {
    return this.http.get<any>(`${environment.api}/api/v1/categories`, {headers: this.authService.getHeaderBearerToken()});
  }
}
