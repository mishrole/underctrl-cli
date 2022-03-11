import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Currency } from '../models/currency';
import { BaseResponse } from '../models/response/base.response';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) { }

  allCurrencies(): Observable<BaseResponse<any>> {
    return this.http.get<any>(`${environment.api}/api/v1/currencies`, {headers: this.authService.getHeaderBearerToken()});
  }

}
