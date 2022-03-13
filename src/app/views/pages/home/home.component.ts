import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit{

  constructor(
    private dataService: DataService
  ) {}

  ngAfterViewInit(): void {
    this.dataService.setOption('breadcrum', 'Home');
  }

  ngOnInit(): void {}

  // user: any;
  // balance: number;
  // accounts: Account[];

  // constructor(
  //   private authService: AuthenticationService,
  //   private accountService: AccountService,
  //   private spinner: NgxSpinnerService,
  //   private utilService: UtilService,
  //   private dataService: DataService
  // ) { }

  // ngAfterViewInit(): void {
  //   this.dataService.setOption('breadcrum', 'Home');
  // }

  // ngOnInit(): void {
  //   if (sessionStorage.getItem('auth') != null) {
  //     const res = JSON.parse(sessionStorage.getItem('auth') || '{}');
  //     // console.log('RES', res);
  //     this.user = res.user;
  //   }

  //   this.getAccounts();
    
  // }

  // getAccounts(): void {
  //   this.spinner.show();

  //   this.accountService.allAccountsByOwner(this.user.id).subscribe(res => {
  //     // console.log('allAccountsByOwner', res.data);
  //     this.accounts = res.data;
  //     // this.balance = this.calculateTotalBalance();
  //   }, err => {
  //     this.spinner.hide();
  //     console.warn(err);
  //     this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
  //   }, () => {
  //     this.spinner.hide(); 
  //     }
  //   );
  // }

  // calculateTotalBalance(): number {
  //   let total = 0;
  //   for (let account of this.accounts) {
  //     total += account.total;
  //   }

  //   return total;
  // }



}
