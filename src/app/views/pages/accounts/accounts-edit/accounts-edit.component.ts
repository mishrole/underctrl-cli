import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Account } from 'src/app/models/account';
import { Currency } from 'src/app/models/currency';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-accounts-edit',
  templateUrl: './accounts-edit.component.html',
  styleUrls: ['./accounts-edit.component.scss']
})
export class AccountsEditComponent implements OnInit, AfterViewInit {

  accountId: number = 0;
  account: Account;

  accountFormGroup!: FormGroup;
  currencies: Currency[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private accountService: AccountService,
    private currencyService: CurrencyService,
  ) { }

  ngAfterViewInit(): void {
    // this.dataService.setOption('breadcrum', 'Accounts');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      this.accountId = res.id ?? null;
      this.getAccount();
      this.createAccountForm();
      this.getCurrencies();
    });
  }

  get frmAccount(): any { return this.accountFormGroup.controls; }

  createAccountForm(): void {
    this.accountFormGroup = this.formBuilder.group({
      Name: ['', Validators.compose([
        Validators.required
      ])],
      Currency: ['', Validators.compose([
        Validators.required
      ])]
    })
  }

  getCurrencies(): void {
    this.spinner.show();

    this.currencyService.allCurrencies().subscribe(res => {
      this.currencies = res.data;
    }, err => {
      this.spinner.hide();
      console.warn(err);
      this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
    }, () => {
      this.spinner.hide(); 
      }
    );
  }

  getAccount(): void {
    this.spinner.show();

    this.accountService.getAccountById(this.accountId).subscribe(res => {
      console.warn(res);
      this.account = res.data;

      this.frmAccount.Name.setValue(res.data.name);
      this.frmAccount.Currency.setValue(res.data.currency.id);

      this.dataService.setOption('breadcrum',`Edit ${res?.data?.name}`);
    }, err => {
      this.spinner.hide();
      console.warn(err);
      this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
    }, () => {
      this.spinner.hide(); 
      }
    );
  }

  updateAccount(): void {
    this.utilService.markFormTouched(this.accountFormGroup);

    if (this.accountFormGroup.valid) {
      const account = new Account();
      account.name = this.frmAccount.Name.value.trim();
      const currency = new Currency();
      currency.id = this.frmAccount.Currency.value;
      account.currency = currency;
      const user = new User();
      user.id = this.authService.getSession()?.user?.id || 0;
      account.owner = user;

      this.spinner.show();

      this.accountService.update(this.accountId, account).subscribe(res => {
        console.warn(res);
        this.utilService.success('Account updated');
        this.router.navigate([`/accounts/${this.accountId}/detail`]);
        }, err => {
          this.spinner.hide();
          console.warn(err);
          this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
        }, () => this.spinner.hide()
      );
    }
  }

  delete(event: any): void {
    event.preventDefault();

    this.utilService.confirmDialog("Are you sure you want to delete this account?", "<small class='text-danger'>Note: There is no Undo.</small>").then((res: any) => {
      if (res) {
        this.spinner.show();

        this.accountService.delete(this.accountId).subscribe(res => {
          console.warn(res);
          this.utilService.success('Account deleted');
          this.router.navigate([`/accounts`]);
        }, err => {
          this.spinner.hide();
          console.warn(err);
          this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
        }, () => {
          this.spinner.hide(); 
          }
        );
      }
    });
  }

}
