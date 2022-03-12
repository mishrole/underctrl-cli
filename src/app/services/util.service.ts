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

  errorHTML(error: any = null, message: string = 'An error has ocurred. Please, contact to the administrator.'): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      html: error && error.error && error.error != null ? `<p>${error.error}</p>` : message,
      showConfirmButton: true,
      confirmButtonColor: 'rgba(49, 151, 149, 0.7)'
    });
  }

  confirmDialog(title: string, message: string = ''): any {
    return Swal.fire({
      title: title,
      html: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgba(49, 151, 149, 0.7)',
      confirmButtonText: 'YES',
      cancelButtonColor: '#d33',
      cancelButtonText: 'NO',
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

  formatDate(date: string) {
    const stringDate = new Date(date);
    let month = '' + (stringDate.getMonth() + 1);
    let day = '' + stringDate.getDate();
    const year = stringDate.getFullYear();

    const hours = stringDate.getHours();
    const minutes = stringDate.getMinutes();
    const seconds = stringDate.getSeconds();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    const formattedTime = [hours, minutes, seconds].join(':');
    const formattedDate = [year, month, day].join('-');
    const result = `${formattedDate} ${formattedTime}`;

    return result;
  }

  toDatetimeLocal(date: string) {
    const newDate = new Date(date),ten = (i: any)=> ((i < 10 ? '0' : '') + i ),
    YYYY = newDate.getFullYear(),
    MTH = ten(newDate.getMonth() + 1),
    DAY = ten(newDate.getDate()),
    HH = ten(newDate.getHours()),
    MM = ten(newDate.getMinutes())
    //,
    // SS = ten(newDate.getSeconds())
    // MS = ten(date.getMilliseconds())

    // return `${YYYY}-${MTH}-${DAY}T${HH}:${MM}:${SS}`
    return `${YYYY}-${MTH}-${DAY}T${HH}:${MM}`
}

  generateErrorMessage(param: any): string {
    let data = param?.error;
    let message = "";

    if (data?.error_description) {
      message = `<p>${data?.error_description}</p>`;
    } else {
      if (data?.detail) {
        message = `<p>${data?.detail}</p>`;
      } else {
        message = `<p>${data || param || 'Unexpected error'}</p>`;
      }
    }

    if (typeof data?.errors === 'object' && data?.errors.length > 0) {
      message += `<p class='text-danger fw-bold'>Cause:</p>`
      for(let error of data?.errors) {
        let values = Object.values(error);
        
        for (let value of values) {
          message += `<p>${value}</p>`
        }
      }
    }

    return message;
  }

}
