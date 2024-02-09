import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { LoaderService } from 'src/app/loader.service';
import { QuizUpdate } from 'src/app/model/Quiz';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { QuizService } from 'src/app/services/Quiz/quiz.service';
import Swal from 'sweetalert2';
import { ExamFeedbackComponent } from './exam-feedback/exam-feedback.component';
@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss'
})
export class ExamComponent implements OnInit {
  countDown!: Subscription;
  counter!: any;
  tick = 1000;
  totalMarks!: number;
  id!: number;
  preview: QuizUpdate = new QuizUpdate();
  date = new Date();
  totalHours!: number;
  clearMinutes!: number;
  isSubmit: boolean = false;
  lisOfAnswers: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
    private loader: LoaderService,
    private location: Location,
    private dialog: MatDialog,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data: { [x: string]: number }) => {
      this.id = data['id'];
    });

    this.quizService.fetchQuizById(this.id, AuthService.userId).subscribe(
      (data: any) => {
        this.preview = data.data as QuizUpdate;
        this.counter = this.preview.hour! * 3600 + this.preview.minutes! * 60;
        this.totalMarks = data.data.marks;
        this.quizService
          .isQuizAttempted(AuthService.getUserId, this.id)
          .subscribe(
            (data: any) => {
              if (data.isSubmit == false) {
                this.quizService
                  .quizStartedOrEnded({
                    quizId: this.preview.id,
                    status: 'attempting',
                    userId: AuthService.getUserId,
                    submitted: false,
                  })
                  .subscribe(
                    (data: any) => {},
                    (error: any) => {}
                  );
              } else {
                this.submitAfterTimeOut('Close');
              }
            },
            (error: any) => {}
          );
      },
      (error: any) => {}
    );
    this.countDown = timer(0, this.tick).subscribe(() => {
      this.counter = this.counter - 1;
      if (this.counter < 0) {
        this.submitAfterTimeOut('Time out');
      }
    });
  }

  refresh() {
    this.quizService.fetchQuizById(this.id, AuthService.getUserId).subscribe(
      (data: any) => {
        this.preview = data.data as QuizUpdate;
      },
      (error: any) => {
        this.alertService.errorAlert('Something went wrong!');
      }
    );
  }

  ngOnDestroy() {
    this.countDown.unsubscribe();
  }

  submitAfterTimeOut(feedback: string) {
    this.countDown.unsubscribe();
    const studentId = AuthService.getUserId;
    this.preview.sections?.map((section) => {
      section.questions.map((question) => {
        if (question.answer != null) {
          this.lisOfAnswers.push({
            questionId: question.id,
            questionType: question.questionType,
            answer: question.answer,
            studentId: studentId,
            id: question.studentSubmittedAnswerId,
          });
        }
      });
    });
    this.loader.loadingOn();
    this.quizService
      .submitAnswers(
        this.preview.id!,
        AuthService.getUserId,
        true,
        feedback,
        this.lisOfAnswers
      )
      .subscribe(
        (data: any) => {
          this.loader.loadingOff();
          this.alertService.successAlert('Exam Saved Successfully!');
          this.isSubmit = true;
          this.location.back();
        },
        (error: any) => {
          this.loader.loadingOff();
          this.alertService.errorAlert('Something went wrong');
        }
      );
  }

  saveAnswers(questionId: number, questionType: string) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to save your answer?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Save',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Save',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.loadingOn();
        const studentId = AuthService.getUserId;
        this.preview.sections?.forEach((section) => {
          section.questions.forEach((question) => {
            if (question.id == questionId) {
              if (question.answer != null) {
                this.lisOfAnswers.push({
                  questionId: questionId,
                  questionType: questionType,
                  studentId: studentId,
                  answer: question.answer,
                  id: question.studentSubmittedAnswerId,
                });
              }
            }
          });
        });
        this.loader.loadingOn();
        this.quizService
          .submitAnswers(
            this.preview.id!,
            AuthService.getUserId,
            false,
            'Attempting',
            this.lisOfAnswers
          )
          .subscribe(
            (data: any) => {
              this.refresh();
              this.lisOfAnswers = [];
              this.loader.loadingOff();
            },
            (error: any) => {
              this.lisOfAnswers = [];
              this.loader.loadingOff();
              this.alertService.errorAlert('Something went wrong');
            }
          );
      } else if (result.isDenied) {
        this.alertService.errorAlert('Answer not saved');
      }
    });
  }

  resetAnswer(questionId: number, answerId: string) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to reset your answer?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Reset',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Reset',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader.loadingOn();
        const userId = AuthService.getUserId;
        this.quizService
          .deleteStudentSubmittedAnswer(
            userId,
            this.preview.id!,
            questionId,
            +answerId
          )
          .subscribe(
            (data: any) => {
              this.loader.loadingOff();
              this.refresh();
            },
            (error: any) => {
              this.loader.loadingOff();
              this.alertService.errorAlert('Something went wrong');
            }
          );
      } else if (result.isDenied) {
        this.alertService.errorAlert('Answer not deleted');
      }
    });
  }

  onSubmit() {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to submit your exam?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Submit',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Submit',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const ref = this.dialog.open(ExamFeedbackComponent, {
          width: '25%',
        });
        ref.componentInstance.feedBackData.subscribe(
          (feedbackComment: string) => {
            this.loader.loadingOn();
            const studentId = AuthService.getUserId;
            this.preview.sections?.map((section) => {
              section.questions.map((question) => {
                if (question.answer != null) {
                  this.lisOfAnswers.push({
                    questionId: question.id,
                    questionType: question.questionType,
                    answer: question.answer,
                    studentId: studentId,
                    id: question.studentSubmittedAnswerId,
                  });
                }
              });
            });
            this.quizService
              .submitAnswers(
                this.preview.id!,
                AuthService.getUserId,
                true,
                feedbackComment,
                this.lisOfAnswers
              )
              .subscribe(
                (data: any) => {
                  this.loader.loadingOff();
                  this.alertService.successAlert(
                    'Exam Submitted Successfully!'
                  );
                  this.isSubmit = true;
                  this.location.back();
                },
                (error: any) => {
                  this.loader.loadingOff();
                  this.alertService.errorAlert('Something went wrong');
                }
              );
          }
        );
      } else if (result.isDenied) {
        this.alertService.errorAlert('Exam not submitted');
      }
    });
  }
}
