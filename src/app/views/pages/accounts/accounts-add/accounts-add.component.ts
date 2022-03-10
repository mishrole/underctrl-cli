import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-accounts-add',
  templateUrl: './accounts-add.component.html',
  styleUrls: ['./accounts-add.component.scss']
})
export class AccountsAddComponent implements OnInit, AfterViewInit {

  constructor(
    private dataService: DataService
  ) { }

  ngAfterViewInit(): void {
    this.dataService.setOption('breadcrum','Accounts / New');
  }

  ngOnInit(): void {
    this.dataService.setOption('breadcrum','Accounts / New');
  }

}
