import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Account } from 'src/app/models/account';
import { Currency } from 'src/app/models/currency';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-accounts-add',
  templateUrl: './accounts-add.component.html',
  styleUrls: ['./accounts-add.component.scss']
})
export class AccountsAddComponent implements OnInit, AfterViewInit {
  currencies: Currency[];
  accountFormGroup!: FormGroup;

  constructor(
    // private dataService: DataService
    private router: Router,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private currencyService: CurrencyService,
    private accountService: AccountService,
  ) { }

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
      console.warn(err);
      this.utilService.error("", err || err?.detail);
      this.spinner.hide();
    }, () => {
      this.spinner.hide(); 
      }
    );
  }

  ngAfterViewInit(): void {
    // this.dataService.setOption('breadcrum','Accounts / New');
  }

  ngOnInit(): void {
    this.createAccountForm();
    this.getCurrencies();
    // this.dataService.setOption('breadcrum','Accounts / New');
  }

  saveAccount(): void {
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

      this.accountService.save(account).subscribe(res => {
        console.warn(res);
        this.utilService.success('Account created');
        this.router.navigate(['/home']);
        }, err => {
          this.spinner.hide();
          console.warn(err);
          this.utilService.error("", err?.error?.error_description);
        }, () => this.spinner.hide()
      );
    } else {
      this.utilService.warn("Please review the information entered");
    }
  }


}
