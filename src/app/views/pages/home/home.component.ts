import { AfterViewInit, Component, OnInit } from '@angular/core';
// import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
// import { BaseChartDirective, Label } from 'ng2-charts';
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
export class HomeComponent implements OnInit, AfterViewInit {

  // pieChartOptions: ChartOptions = {
  //   responsive: true,
  //   legend: {
  //     position: 'bottom',
  //   },
  //   tooltips: {
  //     enabled: true,
  //     mode: 'single',
  //     callbacks: {
  //       label: (tooltipItems: any, data: any) => {
  //         return data.datasets[0].data[tooltipItems.index] + ' %';
  //       }
  //     }
  //   },
  // };

  // pieChartType: ChartType = 'pie';
  // pieChartLegend = true;
  // pieChartPlugins = [];

  // // From database
  // pieChartLabels: Label[] = ['Nitrogen', 'Oxygen', 'Argon', 'Carbon dioxide'];
  // pieChartData: number[] = [78.09, 20.95, 0.93, 0.03];
  // pieChartColors = [
  //   {
  //     backgroundColor: ['rgba(168, 56, 93,0.8)', 'rgba(0, 191, 165,0.8)', 'rgba(1, 87, 155, 0.8)', 'rgba(122, 163, 229, 0.8)'],
  //   },
  // ];

  constructor(
    private dataService: DataService
  ) {}

  ngAfterViewInit(): void {
    this.dataService.setOption('breadcrum', 'Home');
  }

  ngOnInit(): void {}

}
