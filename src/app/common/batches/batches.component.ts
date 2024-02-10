import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../loader.service';
import { BatchList } from '../../model/BatchMappingVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AuthService } from '../../services/auth.service';
import { InstituteService } from '../../services/institute/institute.service';

@Component({
  selector: 'app-batches',
   
  templateUrl: './batches.component.html',
  styleUrl: './batches.component.scss'
})
export class BatchesComponent implements OnInit {
  today = new Date();
  batches: BatchList[] = [];
  courseId!: number;
  batchId!: number;
  courseName!: string;
  constructor(
    private route: ActivatedRoute,
    private instituteService: InstituteService,
    private loader: LoaderService,
    private router: Router,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.queryParams?.['id'];
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
    this.courseName = this.route.snapshot.queryParams?.['courseName'];
    this.loader
      .showLoader(this.instituteService.getMyBatches(this.courseId))
      .subscribe(
        (data: any) => {
          this.batches = data;
        },
        (error: any) => {
          this.alertService.errorAlert('Error while fetching batches');
        }
      );
  }

  navigateToEnrollmentDetails(courseId: any, batchId: any) {
    this.router.navigate(
      [`${AuthService.getModulePrefix}/all-info`],
      {
        queryParams: { courseId: courseId, idbatch: batchId },
      }
    );
  }

  getFirstChar(str: any) {
    var numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var arr = str.split(' ');
    var newStr = '';
    for (var i = 0; i < arr.length; i++) {
      newStr += arr[i].charAt(0);
      if (numArr.includes(arr[i].charAt(1))) {
        newStr += arr[i].charAt(1);
      }
    }
    return newStr;
  }
}
