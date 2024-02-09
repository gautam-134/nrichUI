import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { QuizUpdate } from 'src/app/model/Quiz';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { QuizApiService } from 'src/app/services/quiz-api.service';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-quiz-preview',
  standalone: true,
  imports: [],
  templateUrl: './quiz-preview.component.html',
  styleUrl: './quiz-preview.component.scss'
})
export class QuizPreviewComponent implements OnInit {
  quizId: number = -1;
  studentId: number = -1;
  preview: QuizUpdate = new QuizUpdate();
  date = new Date();
  feedback!: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private quizApiService: QuizApiService,
    private studentService: StudentService,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.quizId = this.activatedRoute.snapshot.queryParams['id'];
    this.studentId = this.activatedRoute.snapshot.queryParams['userId'];
    if (this.studentId) {
      this.fetchQuizResult(this.quizId, this.studentId);
    } else {
      this.fetchQuizPreview(this.quizId);
    }
  }

  fetchQuizPreview(quizId: number) {
    this.loader.showLoader(this.quizApiService.fetchQuiz(quizId)).subscribe(
      (data: any) => {
        this.preview = data as QuizUpdate;
      },
      (error: HttpErrorResponse) => {}
    );
  }

  fetchQuizResult(quizId: number, studentId: number) {
    this.loader
      .showLoader(this.studentService.fetchQuizResultById(quizId, studentId))
      .subscribe({
        next: (data) => {
          this.preview = data as QuizUpdate;
          this.viewComment();
        },
        error: (error) => {
          this.alertService.errorAlert('Something went wrong!');
        },
      });
  }

  viewComment() {
    this.loader.loadingOn();
    this.studentService
      .getFeedBackComment(this.quizId, this.studentId)
      .subscribe(
        (data: any) => {
          this.feedback = data.feedbackComment;
          this.loader.loadingOff();
        },
        (error: any) => {
          this.loader.loadingOff();
          this.alertService.errorAlert('Something went wrong!');
        }
      );
  }
}