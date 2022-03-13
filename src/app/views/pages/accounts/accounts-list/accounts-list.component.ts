import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit, AfterViewInit {

  user: any;
  balance: number;
  accounts: Account[];

  constructor(
    private authService: AuthenticationService,
    private accountService: AccountService,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    private dataService: DataService
  ) { }

  ngAfterViewInit(): void {
    this.dataService.setOption('breadcrum', 'Accounts');
  }

  ngOnInit(): void {
    let session = this.authService.getSession();
    this.user = session?.user;

    this.getAccounts();
  }

  getAccounts(): void {
    this.spinner.show();

    this.accountService.allAccountsByOwner(this.user.id).subscribe(res => {
      console.warn(res);
      this.accounts = res.data;
    }, err => {
      this.spinner.hide();
      console.warn(err);
      this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
    }, () => {
      this.spinner.hide(); 
      }
    );
  }

}
