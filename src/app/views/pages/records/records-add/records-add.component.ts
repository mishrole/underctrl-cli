import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Account } from 'src/app/models/account';
import { Category } from 'src/app/models/category';
import { Type } from 'src/app/models/type';
import { Record } from 'src/app/models/record';
import { AccountService } from 'src/app/services/account.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CategoryService } from 'src/app/services/category.service';
import { RecordService } from 'src/app/services/record.service';
import { TypeService } from 'src/app/services/type.service';
import { UtilService } from 'src/app/services/util.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-records-add',
  templateUrl: './records-add.component.html',
  styleUrls: ['./records-add.component.scss']
})
export class RecordsAddComponent implements OnInit, AfterViewInit {

  recordFormGroup!: FormGroup;
  accounts: Account[];
  types: Type[];
  categories: Category[];

  today: any;
  user: any;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private accountService: AccountService,
    private recordService: RecordService,
    private categoryService: CategoryService,
    private typeService: TypeService,
    private dataService: DataService
  ) { }

  ngAfterViewInit(): void {
    this.dataService.setOption('breadcrum','New Record');
  }

  get frmRecord(): any { return this.recordFormGroup.controls; }

  createRecordForm(): void {
    this.recordFormGroup = this.formBuilder.group({
      Name: ['', Validators.compose([
        Validators.required
      ])],
      Concept: ['', Validators.compose([
        Validators.required
      ])],
      Amount: ['', Validators.compose([
        Validators.required,
        Validators.min(0)
      ])],
      RecordDate: ['', Validators.compose([
        Validators.required
      ])],
      Category: ['', Validators.compose([
        Validators.required
      ])],
      Type: ['', Validators.compose([
        Validators.required
      ])],
      Account: ['', Validators.compose([
        Validators.required
      ])]
    })
  }

  ngOnInit(): void {
    this.today = new Date().toISOString().split("T")[0];
    this.user = this.authService.getSession()?.user;

    this.createRecordForm();

    this.getAccounts();
    this.getCategories();
    this.getTypes();
  }

  saveRecord(): void {
    this.utilService.markFormTouched(this.recordFormGroup);

    if (this.recordFormGroup.valid) {
      const record = new Record();
      record.name = this.frmRecord.Name.value.trim();
      record.concept = this.frmRecord.Concept.value.trim();
      record.amount = this.frmRecord.Amount.value;
      record.recordDate = this.utilService.formatDate(this.frmRecord.RecordDate.value);

      const category = new Category();
      category.id = this.frmRecord.Category.value;
      const type = new Type();
      type.id = this.frmRecord.Type.value;
      const account = new Account();
      account.id = this.frmRecord.Account.value;

      record.account = account;
      record.type = type;
      record.category = category;

      this.spinner.show();

      this.recordService.save(record).subscribe(res => {
        console.warn(res);
        this.utilService.success('Record created');
        this.router.navigate(['/home']);
      }, err => {
          this.spinner.hide();
          console.warn(err);
          this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
        }, () => this.spinner.hide()
      );
    }
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

  getCategories(): void {
    this.spinner.show();

    this.categoryService.allCategories().subscribe(res => {
      this.categories = res.data;
    }, err => {
      this.spinner.hide();
      console.warn(err);
      this.utilService.errorHTML("", this.utilService.generateErrorMessage(err));
    }, () => {
      this.spinner.hide(); 
      }
    );
  }

  getTypes(): void {
    this.spinner.show();

    this.typeService.allTypes().subscribe(res => {
      this.types = res.data;
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
