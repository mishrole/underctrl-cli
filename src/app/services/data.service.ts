import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data: any = {};
  subject = new Subject();

  setOption(option: any, value: any) {
    this.data[option] = value;
    this.subject.next(this.data);
    // console.log(this.data);
  }  

  // getOption() {
  //   return this.data;
  // }

  constructor() { }
}
