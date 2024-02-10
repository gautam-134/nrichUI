import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexXAxis,
} from 'ng-apexcharts';
import { LoaderService } from '../../loader.service';
import { CrmDashboardAnalytics } from '../../model/CrmDashboardAnalytics';
import { CrmFormFieldsVO } from '../../model/CrmFormFieldsVO';
import { CrmStatus, CrmSubStatus } from '../../model/CrmStatusAndSubStatus';
import { InstituteLeadsVO } from '../../model/InstituteLeadsVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { CRMService } from '../../services/CRM/crm.service';

@Component({
  selector: 'app-institute-admin-dashboard',
   
  templateUrl: './institute-admin-dashboard.component.html',
  styleUrl: './institute-admin-dashboard.component.scss'
})
export class InstituteAdminDashboardComponent implements OnInit {
  analytics = new CrmDashboardAnalytics();
  @ViewChild('inputFile') myInputVariable!: ElementRef;
  additionalFields: CrmFormFieldsVO[] = [];
  csvRecords: any[] = [];
  header = false;
  instituteLeads: InstituteLeadsVO[] = [];
  instituteLead: InstituteLeadsVO = new InstituteLeadsVO();
  page: number = 0;
  size: number = 5;
  searchParam: string = '';
  totalCount!: number;
  typeOfShorting: boolean = true;
  apexChart!: ApexChart;
  series!: ApexAxisChartSeries;
  title!: ApexTitleSubtitle;
  xAxix!: ApexXAxis;
  leadStats: number[] = [];
  totalLeads: number = 0;
  cnpLeads: number = 0;

  radialBar!: ApexChart;
  radialBarSeries!: ApexNonAxisChartSeries;
  radiallabels: string[] = ['Lead'];
  radialplotOptions!: ApexPlotOptions;

  crmStatus: CrmStatus[] = [];
  crmSubStatus: CrmSubStatus[] = [];
  formFields!: CrmFormFieldsVO[];

  workbookData: any[] = [];
  isDropdownOpen = false;
  selectedOption: any = null;
  selectedValue="Today";
  categories: string[] = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  statsType: string="Month";
  constructor(
    private crmService: CRMService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchDashboardAnalytics();
    this.fetchTotalLeadsRecord();
  }

openAllNewLeads(){
  this.router.navigate([`crm/leads-listing`], {
    queryParams: {type:'newLeads'},
  });
}

openAllClosedLeads(){
  this.router.navigate([`crm/leads-listing`], {
    queryParams: {type:'closedLeads'},
  });
}

openAllConvertedLeads(){
  this.router.navigate([`crm/leads-listing`], {
    queryParams: {type:'convertedLeads'},
  });
}

openAllPossibleLeads(){
  this.router.navigate([`crm/leads-listing`], {
    queryParams: {type:'prospectiveLeads'},
  });
}
  fetchDashboardAnalytics() {
    this.loader
      .showLoader(this.crmService.fetchCrmDashboardAnaytics())
      .subscribe({
        next: (data: CrmDashboardAnalytics) => {
          this.analytics = data;
          this.leadStats=data.leadStats;
          this.initializeCharOptions();
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(
            'Error while fetching dashboard analytics'
          );
        },
      });
  }
  onFilterChange(event: any){
    this.selectedValue = event.target.value;
    this.fetchTotalLeadsRecord();
  }
  onValueChange(event: any) {
    this.selectedValue = event.target.value;
    if (this.selectedValue == 'Year') {
      this.statsType="Year";
      this.fetchLeadsStats();
      const startYear = 2021;
      const endYear = new Date().getFullYear();
      this.categories = this.generateYears(startYear, endYear);
      this.initializeCharOptions();
    } else {
      this.statsType="Month";
      this.fetchLeadsStats();
      this.categories = [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'Jun',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];
      this.initializeCharOptions();
    }

  }
  generateYears(startYear: number, endYear: number) {
    const years = [];

    for (let i = startYear; i <= endYear; i++) {
      years.push(i.toString());
    }
    return years;
  }
  private initializeLeadRadialBar(): void {
    this.radialBar = {
      type: 'radialBar',
      height: '280px',
      width: '300px',
    };
    let usedStorage =
      (this.cnpLeads / this.totalLeads) * 100;
    this.radialBarSeries = [usedStorage];
    this.radiallabels = this.radiallabels;
    this.radialplotOptions = {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total Leads',
            formatter: (w) => {
              return this.totalLeads + '';
            },
          },
        },
      },
    };
  }

  private initializeCharOptions(): void {
    this.apexChart = {
      type: 'line',
      height: '250px',
      width: '725px',
      toolbar: {
        show: false
      },
    };
    this.series = [
      {
        name: 'Leads Generated',
        data: this.leadStats,
      },
    ];
    this.title = {
      text: '',
    };
    this.xAxix = { categories: this.categories };
  }

  bulkUpload() {
    this.router.navigate([`crm/leads-csv-upload`]);
  }

  fetchLeadsStats(){
    this.loader
    .showLoader(this.crmService.fetchCrmDashboardLeadsStats(this.statsType))
    .subscribe({
      next: (data:any) => {
        this.leadStats = data;
        this.initializeCharOptions();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert(
          'Error while fetching dashboard analytics'
        );
      },
    });
  }

  fetchTotalLeadsRecord(){
    this.loader
    .showLoader(this.crmService.fetchTotalLeadsRecord(this.selectedValue))
    .subscribe({
      next: (data:any) => {
        this.totalLeads = data.totalLeads;
        this.cnpLeads=data.cnpLeads;
        this.initializeLeadRadialBar();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert(
          'Error while fetching analytics'
        );
      },
    });
  }
  

}
