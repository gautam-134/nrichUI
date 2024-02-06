import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Auth } from 'src/app/model/Auth';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-select-institute',
  standalone: true,
  imports: [],
  templateUrl: './select-institute.component.html',
  styleUrl: './select-institute.component.scss'
})
export class SelectInstituteComponent implements OnInit {
  institutes: UserInstitutes[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<SelectInstituteComponent>,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.authService.enrollInstituesListRes().subscribe(
      (data: UserInstitutes[]) => {
        this.institutes = data;
      },
      (error: any) => {}
    );
  }

  addRoleAndInstitute(data: number) {}

  submit(id: any) {
    if (!id) {
      this.alertService.errorAlert('Please Select Institute');
      return;
    }
    const selectedInstitute = this.institutes.find(
      (institute) => institute.instituteId == +id
    );
    const auth: Auth = JSON.parse(localStorage.getItem('auth') || '{}');
    auth.role.roleType = selectedInstitute?.roleType;
    auth.selectedInstitute = selectedInstitute?.instituteId;
    localStorage.setItem('auth', JSON.stringify(auth));
    this.authService.loggedInSubject.next(true);
    this.router.navigate([`${AuthService.getModulePrefix}/onboard`]);
    this.dialogRef.close();
  }
}

export class UserInstitutes {
  instituteId!: number;
  instituteName!: string;
  roleType!: string;
  instituteImage!: string;
}
