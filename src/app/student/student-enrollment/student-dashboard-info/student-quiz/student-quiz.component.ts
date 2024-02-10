import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalAlertService } from '../../../../services/alert/swal-alert.service';
import { AuthService } from '../../../../services/auth.service';
import { TeacherService } from '../../../../services/teacher/teacher.service';
import { InstructionsComponent } from './instructions/instructions.component';

@Component({
  selector: 'app-student-quiz',
   
  templateUrl: './student-quiz.component.html',
  styleUrl: './student-quiz.component.scss'
})
export class StudentQuizComponent implements OnInit {
  page = 0;
  size = 5;
  totalPendingCount: number = 0;
  totalPublishedCount: number = 0;
  buttonText = 'Start Quiz';
  displayedColumns: string[] = [
    'Name',
    'Marks',
    'StartTime',
    'EndTime',
    'examDuration',
    'Teacher Name',
    'Action',
  ];

  publishedQuiz: any[] = [];
  pendingQuiz: any[] = [];

  typeOfShorting: boolean = true;
  type: any;
  constructor(
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private router: Router,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.fetchAllPendingQuizzes(this.page);
    this.fetchAllPublishedQuizzes(this.page);
  }

  fetchAllPendingQuizzes(page: number) {
    this.teacherService
      .fetchAllPendingQuizes(
        +this.route.snapshot.queryParams?.['idbatch'],
        page,
        this.size
      )
      .subscribe((res: any) => {
        this.pendingQuiz = res.quizs.reverse();
        this.totalPendingCount = res.totalCount;
      });
  }

  fetchAllPublishedQuizzes(page: number) {
    this.teacherService
      .fetchAllPublishedQuizzes(
        +this.route.snapshot.queryParams?.['idbatch'],
        page,
        this.size
      )
      .subscribe((res: any) => {
        this.publishedQuiz = res.quizs.reverse();
        this.totalPublishedCount = res.totalCount;
      });
  }

  pageChange(event: any) {
    this.fetchAllPendingQuizzes(event);
    this.fetchAllPublishedQuizzes(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.fetchAllPendingQuizzes(0);
    this.fetchAllPublishedQuizzes(0);
  }

  startQuizOrGetResult(
    quiz: any,
    startDateTime: any,
    endDateTime: any,
    studentSubmittedQuizs: any[]
  ) {
    if (AuthService.getRoleType != 'Student') {
      this.alertService.okErrorAlert(
        'You don`t have permissions to start quiz'
      );
      return;
    }
    var startTime = new Date(startDateTime).getTime();
    var endTime = new Date(endDateTime).getTime();
    var currentTime = new Date().getTime();
    if (
      currentTime >= startTime &&
      currentTime <= endTime &&
      !this.checkResult(studentSubmittedQuizs)
    ) {
      let dialogref = this.matDialog.open(InstructionsComponent, {
        data: {
          entry: true,
          params: {
            id: quiz.id,
            hour: quiz.hour,
            minutes: quiz.minutes,
            totalMarks: quiz.marks,
            negitiveMarking: quiz.negtiveMarking,
            negtiveMarks: quiz.negtiveMarks,
          },
        },
      });
      dialogref.componentInstance.uploadSuccess.subscribe((res: boolean) => {
        if (res) {
          this.router.navigate(['/student/exam', quiz.id]);
        }
      });
    }
  }

  checkTime(
    startDateTime: any,
    endDateTime: any,
    studentSubmittedQuizs: any[]
  ) {
    var startTime = new Date(startDateTime).getTime();
    var endTime = new Date(endDateTime).getTime();
    var currentTime = new Date().getTime();
    if (currentTime <= startTime && studentSubmittedQuizs.length == 0) {
      this.buttonText = 'Coming Soon';
      return true;
    }
    if (
      currentTime >= startTime &&
      currentTime <= endTime &&
      !this.checkResult(studentSubmittedQuizs)
    ) {
      this.buttonText = 'Start Quiz';
      return false;
    }
    if (currentTime <= endTime && this.checkResult(studentSubmittedQuizs)) {
      this.buttonText = 'Test Submitted';
      return true;
    }
    if (currentTime >= endTime && this.checkResult(studentSubmittedQuizs)) {
      this.buttonText = 'Test Submitted';
      return true;
    }
    if (currentTime >= endTime && !this.checkResult(studentSubmittedQuizs)) {
      this.buttonText = 'Test Expired';
      return true;
    }
    return;
  }

  checkResult(studentSubmittedQuizs: any[]) {
    if (
      studentSubmittedQuizs.some(
        (studentSubmittedQuiz: any) =>
          studentSubmittedQuiz.userId == AuthService.getUserId &&
          studentSubmittedQuiz.submitted == true
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  preview(quizId: number) {
    this.router.navigate([AuthService.getModulePrefix+`/quiz-preview`], {
      queryParams: { id: quizId, userId: AuthService.getUserId },
    });
  }
}

