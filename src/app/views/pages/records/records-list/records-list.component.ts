import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from 'src/app/core/constants';
import { Account } from 'src/app/models/account';
import { Record } from 'src/app/models/record';
import { RecordFilterAndOrAccountRequest } from 'src/app/models/request/record-filter-account.request';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { RecordService } from 'src/app/services/record.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.scss']
})
export class RecordsListComponent implements OnInit, AfterViewInit {

  CONSTANT_TYPE_INCOME = Constants.TYPE_INCOME;
  CONSTANT_TYPE_EXPENSE = Constants.TYPE_EXPENSE;

  filter: RecordFilterAndOrAccountRequest = new RecordFilterAndOrAccountRequest();

  recordFormGroup!: FormGroup;
  accounts: Account[];
  records: Record[];

  user: any;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private accountService: AccountService,
    private recordService: RecordService,
    private dataService: DataService
  ) { }

  ngAfterViewInit(): void {
    this.dataService.setOption('breadcrum','Records');
  }

  get frmRecord(): any { return this.recordFormGroup.controls; }

  ngOnInit(): void {
    const session = this.authService.getSession();
    this.user = session?.user;
    this.createRecordForm();
    this.getAccounts();
    this.getRecordsFiltered();
  }

  createRecordForm(): void {
    this.recordFormGroup = this.formBuilder.group({
      Keyword: [''],
      Account: ['']
    })
  }

  getAccounts(): void {
    this.spinner.show();

    this.accountService.allAccountsByOwner(this.user.id).subscribe(res => {
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

  getRecordsFiltered(): void {
    this.utilService.markFormTouched(this.recordFormGroup);

    if (this.recordFormGroup.valid) {
      this.filter.keyword = this.frmRecord.Keyword.value.trim();
      this.filter.accountId = this.frmRecord.Account.value;
      
      this.recordService.allRecordsByOwnerAndOrAccountAndFilters(this.user.id, this.filter).subscribe(res => {
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

}
