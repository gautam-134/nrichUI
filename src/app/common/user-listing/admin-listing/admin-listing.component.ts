import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { InstituteService } from 'src/app/services/institute/institute.service';
import { UserFormVO } from '../../add-user/add-user.component';

@Component({
  selector: 'app-admin-listing',
  standalone: true,
  imports: [],
  templateUrl: './admin-listing.component.html',
  styleUrl: './admin-listing.component.scss'
})
export class AdminListingComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  totalAdmins = 0;
  subject = new Subject();
  result$!: Observable<any>;
  admins: UserFormVO[] = [];
  searchParam: string = '';
  typeOfShorting: boolean = true;
  type: any;
  allowedAdminsAndTeacher:number|undefined
  @Input('allowedAdmins') set allowedAdmins(value:number | undefined){
    this.allowedAdminsAndTeacher=value
  }
  constructor(
    private loader: LoaderService,
    private instituteService: InstituteService,
    private authService: AuthService,
    private router: Router,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter();
  }

  refresh(page: number) {
    this.loader
      .showLoader(
        this.instituteService.fetchInstituteUsers(
          AuthService.getInstituteId,
          'Admin',
          page,
          this.size,
          this.searchParam
        )
      )
      .subscribe(
        (res) => {
          this.admins = res.users;
          this.totalAdmins = res.totalCount;
        },
        (err) => {
          this.alertService.errorAlert('Error while fetching admins list');
        }
      );
  }

  editDetails(id: number) {
    this.router.navigate([`${AuthService.getModulePrefix}/add-user`], {
      queryParams: { id: id },
    });
  }

  disableUser(element: any, event: any) {
    this.authService.disableUser(element.id).subscribe({
      next: (data: any) => {},
      error: (error: HttpErrorResponse) => {
        element.featured = !event.target.checked;
        this.alertService.errorAlert('Something went wrong!');
      },
    });
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText) =>
          searchText !== ''
            ? this.instituteService.fetchInstituteUsers(
                AuthService.getInstituteId,
                'Admin',
                this.page,
                this.size,
                this.searchParam
              )
            : of([])
        )
      )
      .subscribe((response) => {
        this.result$ = response;
        this.result$.subscribe((value) => {
          this.admins = value?.users;
          this.totalAdmins = value.totalCount;
        });
      });
  }

  pageChange(event: any) {
    this.refresh(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
