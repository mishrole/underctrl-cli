import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
@Injectable({
  providedIn: 'root'
})

export class UtilService {

  breadcrum: string;

  constructor(private http: HttpClient) { }

  getBreadcrum(): string {
    return this.breadcrum;
  }

  setBreadcrum(breadcrum: string): void {
    this.breadcrum = breadcrum;
  }
  

  success(message: string): void {
    Swal.fire({
      showConfirmButton: false, timer: 3000, title: message, icon: 'success'
    });
  }

  warn(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: message,
      showConfirmButton: true
    });
  }

  error(error: any = null, message: string = 'An error has ocurred. Please, contact to the administrator.'): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error && error.error && error.error != null ? error.error : message,
      showConfirmButton: true
    });
  }

  confirmDialog(message: string): any {
    return Swal.fire({
      title: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        return result.value;
      }
    });
  }

  confirmWarn(message: string): any {
    return Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: message,
      showConfirmButton: true
    })
    .then((result) => {
      if (result.isConfirmed) {
        return result.value;
      }
    });
  }

  questionOption(message: string, titleOptionConfirm: string, titleOptionCancel: string): any {
    return Swal.fire({
      icon: 'question',
      title: message,
      showCancelButton: false,
      showDenyButton: true,
      reverseButtons: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: titleOptionConfirm,
      denyButtonColor: '#b1b1b1',
      denyButtonText: titleOptionCancel,
    }).then((result) => {
      if (result.isConfirmed) {
        return 'confirm';
      } else if (result.isDenied) {
        return 'deny';
      } else {
        return 'cancel';
      }
    });
  }

  markFormTouched(group: FormGroup | FormArray) {
    const controls: any = group.controls;
    Object.keys(controls).forEach((key: string) => {
      const control = controls[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  };

}
