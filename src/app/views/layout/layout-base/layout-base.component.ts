import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from 'src/app/models/menu-item';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-layout-base',
  templateUrl: './layout-base.component.html',
  styleUrls: ['./layout-base.component.scss']
})
export class LayoutBaseComponent implements OnInit {
  
  breadcrum: any = 'Under CTRL';
  search: boolean = false;
  user: any;

  menu: MenuItem[];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private utilService: UtilService,
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // It works but not as expected, routerlink doesn't change path so title remains as 'Home'

    this.dataService.subject.subscribe((res: any) => {
      this.breadcrum = res.breadcrum;
      this.search = res.search;
      // Avoid error NG0100
      this.changeDetectorRef.detectChanges();
    });

    if (sessionStorage.getItem('auth') != null) {
      const res = JSON.parse(sessionStorage.getItem('auth') || '{}');
      // console.log('RES', res);
      this.user = res.user;
    }

    // this.routes = this.router.url.split('/');
    // this.routes = window.location.pathname.split('/').filter(element => element);

    this.menu = this.authenticationService.loadMenuItems(this.user);
  }

  logOut(event: any): void {
    event.preventDefault();
    this.authenticationService.logout();
    this.router.navigate(['/auth']);
  }

}
