import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Record } from 'src/app/models/record';
import { DataService } from 'src/app/services/data.service';
import { RecordService } from 'src/app/services/record.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-records-details',
  templateUrl: './records-details.component.html',
  styleUrls: ['./records-details.component.scss']
})
export class RecordsDetailsComponent implements OnInit, AfterViewInit {

  recordId: number = 0;
  record: Record;

  constructor(
    private router: Router,
    private recordService : RecordService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
  ) { }

  ngAfterViewInit(): void {
    this.dataService.setOption('breadcrum','Record Details');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      this.recordId = res.id ?? null;
    });

    this.getRecord();
  }

  delete(event: any) {
    event.preventDefault();

    this.utilService.confirmDialog("Are you sure you want to delete this record?", "<small class='text-danger'>Note: There is no Undo.</small>").then((res: any) => {
      if (res) {
        this.spinner.show();

        this.recordService.delete(this.recordId).subscribe(res => {
          console.warn(res);
          this.utilService.success('Record deleted');
          this.router.navigate([`/accounts/${this.record.account.id}/detail`]);
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

  getRecord(): void {
    this.spinner.show();

    this.recordService.getRecordById(this.recordId).subscribe(res => {
      console.warn(res);
      this.record = res.data;
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
