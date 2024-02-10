import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../../loader.service';
import { SupportDetails } from '../../model/SupportDetails';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AuthService } from '../../services/auth.service';
import { InstituteService } from '../../services/institute/institute.service';
import { SupportService } from '../../services/Support/support.service';
import Swal from 'sweetalert2';
import { InstituteFormVO } from '../add-edit-institute/add-edit-institute.component';
import { UserFormVO } from '../add-user/add-user.component';

@Component({
  selector: 'app-user-listing',
   
  templateUrl: './user-listing.component.html',
  styleUrl: './user-listing.component.scss'
})
export class UserListingComponent implements OnInit {
  tab: number = 1;
  csvRecords: any[] = [];
  usersData!: UserFormVO[];
  header = false;
  @ViewChild('inputFile')
  myInputVariable!: ElementRef;
  offlineEnrollmentsCount: number = 0;
  supportDetails!: SupportDetails[];
  constructor(
    private loader: LoaderService,
    private instituteService: InstituteService,
    private router: Router,
    private supportService: SupportService,
    private alertService: SwalAlertService,
  ) {}


  ngOnInit(): void {
    this.loader
      .showLoader(this.instituteService.getOfflineApplicationsCount())
      .subscribe(
        (data) => {
          this.offlineEnrollmentsCount = data;
        },
        (error) => {
          this.alertService.errorAlert('Error while fetching enrollment count');
        }
      );

    this.supportDetails = this.supportService.userSupport();
  }

  addUser() {
    this.loader
      .showLoader(
        this.instituteService.getInstituteDetails(
          JSON.parse(localStorage.getItem('auth') as string).selectedInstitute
        )
      )
      .subscribe((res: InstituteFormVO) => {
        if (res.instituteName == null || res.instituteName == '') {
          this.showWarning();
        } else {
          this.router.navigate([`${AuthService.getModulePrefix}/add-user`]);
        }
      });
  }

  showWarning() {
    return Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'You have not completed the Institution Details? </p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Confirmation',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Add Institution Details',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate([`${AuthService.getModulePrefix}/institutes`]);
        return true;
      } else {
        return false;
      }
    });
  }

  bulkUpload() {
    this.router.navigate([`${AuthService.getModulePrefix}/bulk-users-upload`]);
  }

  OffileEnrollment() {
    this.router.navigate([`${AuthService.getModulePrefix}/offline-enrollment`]);
  }
}