import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-base',
  templateUrl: './layout-base.component.html',
  styleUrls: ['./layout-base.component.scss']
})
export class LayoutBaseComponent implements OnInit {
  
  route: any;
  user: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('auth') != null) {
      const res = JSON.parse(sessionStorage.getItem('auth') || '{}');
      // console.log('RES', res);
      this.user = res.user;
    }

    this.route = this.router.url.slice(1, this.router.url.length);
  }

}
