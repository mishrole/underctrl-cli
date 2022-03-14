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
  search = false;
  user: any;
  hideFab = false;

  menu: MenuItem[];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private utilService: UtilService,
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    // Observe changes in breadcrum
    this.dataService.subject.subscribe((res: any) => {
      this.breadcrum = res.breadcrum;
      this.search = res.search;
      this.hideFab = res.hideFab;

      if (res.profileUpdated) {
        const session = this.authenticationService.getSession();
        this.user = session?.user;
      }

      // Avoid error NG0100
      this.changeDetectorRef.detectChanges();
    });

    if (sessionStorage.getItem('auth') != null) {
      const res = JSON.parse(sessionStorage.getItem('auth') || '{}');
      this.user = res.user;
    }

    this.menu = this.authenticationService.loadMenuItems(this.user);
  }

  logOut(event: any): void {
    event.preventDefault();
    this.authenticationService.logout();
    this.router.navigate(['/auth']);
  }

}
