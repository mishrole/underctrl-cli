import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatMap } from 'rxjs/operators';
import { Constants } from 'src/app/core/constants';
import { Account } from 'src/app/models/account';
import { Record } from 'src/app/models/record';
import { RecordFilterRequest } from 'src/app/models/request/record-filter.request';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { RecordService } from 'src/app/services/record.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-accounts-details',
  templateUrl: './accounts-details.component.html',
  styleUrls: ['./accounts-details.component.scss']
})
export class AccountsDetailsComponent implements OnInit {

  CONSTANT_TYPE_INCOME = Constants.TYPE_INCOME;
  CONSTANT_TYPE_EXPENSE = Constants.TYPE_EXPENSE;

  filter: RecordFilterRequest = new RecordFilterRequest();

  accountId: number = 0;
  account: Account;
  records: Record[];

  accountFormGroup!: FormGroup;

  constructor(
    private utilService: UtilService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private dataService: DataService,
    private accountService: AccountService,
    private recordService: RecordService
  ) { }

  get frmAccount(): any { return this.accountFormGroup.controls; }

  ngOnInit(): void {
    this.createAccountForm();
    this.activatedRoute.params.subscribe(res => {
      this.accountId = res.id ?? null;
      this.getAccountById();
      this.getRecordsFiltered();
    });

    // this.dataService.setOption('search', true);
  }

  // TODO: ADD PIPE TO CALL BOTH 

  getAccountById(): void {
    this.spinner.show();

    this.accountService.getAccountById(this.accountId).subscribe(res => {
      console.warn(res);
      this.account = res.data;
      this.dataService.setOption('breadcrum',`Account ${res.data?.name || ''}`);
      }, err => {
        this.spinner.hide();
        console.warn(err);
        this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
      }, () => this.spinner.hide()
    );
  }

  // getRecordsFiltered(): void {
  //   this.spinner.show();
  //   this.recordService.allRecordsByAccount(this.accountId, this.filter).subscribe(res => {
  //     console.warn(res);
  //     this.records = res.data;
  //     }, err => {
  //       this.spinner.hide();
  //       console.warn(err);
  //       this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
  //     }, () => this.spinner.hide()
  //   );
  // }

  getRecordsFiltered(): void {
    this.utilService.markFormTouched(this.accountFormGroup);

    if (this.accountFormGroup.valid) {
      this.filter.keyword = this.frmAccount.Keyword.value.trim();
      
      this.recordService.allRecordsByAccount(this.accountId, this.filter).subscribe(res => {
        console.warn(res);
        this.records = res.data;
        }, err => {
          this.spinner.hide();
          console.warn(err);
          this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
        }, () => this.spinner.hide()
      );

    }
  }

  createAccountForm(): void {
    this.accountFormGroup = this.formBuilder.group({
      Keyword: ['']
    })
  }

}
