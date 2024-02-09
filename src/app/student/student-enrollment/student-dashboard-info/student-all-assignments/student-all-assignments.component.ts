import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { assignmentVO } from 'src/app/model/assignmentVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AssignmentService } from 'src/app/services/assignment/assignment.service';
import { StudentService } from 'src/app/services/student/student.service';

import { SubmitAssignmentComponent } from './submit-assignment/submit-assignment.component';

@Component({
  selector: 'app-student-all-assignments',
  standalone: true,
  imports: [],
  templateUrl: './student-all-assignments.component.html',
  styleUrl: './student-all-assignments.component.scss'
})
export class StudentAllAssignmentsComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  submittedPage: number = 0;
  submittedSize: number = 5;
  batchId!: number;
  totalSubmitCount!: number;
  totalPendingCount!: number;
  assignments!: assignmentVO[];
  btnText: string = 'View';
  submittedType: String = 'submitted';
  pendingType: String = 'pending';
  disableRequestButton: boolean = false;
  pendingAssignments!: assignmentVO[];
  typeOfShorting: boolean = true;
  type: any;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private dialog: MatDialog,
    private assignemntService: AssignmentService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
    this.fetchSubmittedAssignments(this.submittedPage);
    this.fetchPendingAssignments(this.page);
  }
  fetchSubmittedAssignments(page: number) {
    this.studentService
      .fetchAssignmentsToStudent(
        this.batchId,
        this.size,
        page,
        this.submittedType
      )
      .subscribe((res: any) => {
        this.assignments = res?.body.assignments;
        this.totalSubmitCount = res?.body.total_count;
      });
  }

  fetchPendingAssignments(page: number) {
    this.studentService
      .fetchAssignmentsToStudent(
        this.batchId,
        this.size,
        page,
        this.pendingType
      )
      .subscribe((res: any) => {
        this.pendingAssignments = res.body.assignments;
        this.totalPendingCount = res?.body.total_count;
      });
  }

  checkGrade(row: any) {
    this.alertService.successAlert('Your Grades are <br><br>' + row.grade);
  }

  checkMarks(row: any) {
    this.alertService.successAlert(
      'Your Marks are <br><br>' + row.marks.toString()
    );
  }

  submitAssignment(element: assignmentVO) {
    this.btnText = 'Submit';
    let dialogRef = this.dialog.open(SubmitAssignmentComponent, {
      width: '90%',
      height: '90%',
      autoFocus: false,
      disableClose: true,
      data: {
        assignment: element,
        buttonText: this.btnText,
      },
    });
    dialogRef.componentInstance.refresh.subscribe((res: any) => {
      if (res) {
        this.fetchSubmittedAssignments(this.page);
        this.fetchPendingAssignments(this.page);

        dialogRef.close();
      }
    });
  }
  viewAssignment(element: assignmentVO) {
    element.assignmentSubmittedOrNot = 'Y';
    let dialogRef = this.dialog.open(SubmitAssignmentComponent, {
      width: '90%',
      height: '90%',
      autoFocus: false,
      disableClose: true,
      data: {
        assignment: element,
      },
    });
    dialogRef.componentInstance.refresh.subscribe((res: any) => {
      if (res) {
        dialogRef.close();
      }
    });
  }

  requestForReevaluation(assignmentId: any) {
    this.assignemntService
      .requestForReevaluation(assignmentId)
      .subscribe((res: any) => {
      //  Swal.isValidParameter('Your Request for Re-evaluation is successfully submitted');
      this.alertService.successAlert('Your Request for Re-evaluation is successfully submitted');
        this.fetchSubmittedAssignments(this.page);
        this.fetchPendingAssignments(this.page);
        this.disableRequestButton = false;
      });
  }

  submitSizeChange(event: number) {
    this.submittedSize = event;
    this.fetchSubmittedAssignments(0);
  }
  submitPageChange(event: number) {
    this.submittedPage = event;
    this.fetchSubmittedAssignments(this.submittedPage);
  }

  pendingPageChange(event: number) {
    this.page = event;
    this.fetchPendingAssignments(this.page);
  }

  pendingSizeChange(event: number) {
    this.size = event;
    this.fetchPendingAssignments(0);
    this.page=0;
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}

