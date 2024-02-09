import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { MappingPageComponent } from 'src/app/common/mapping-page/mapping-page.component';
import { LoaderService } from 'src/app/loader.service';
import { MappingType } from 'src/app/model/MappingType';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { QuizApiService } from 'src/app/services/quiz-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss'
})
export class QuizListComponent implements OnInit, AfterViewInit {
  totalElement!: number;
  quizs: any[] = [];
  pageNumber: number = 0;
  size: number = 5;
  search: string = '';
  typeOfShorting: boolean = true;
  type: any;
  publishText = 'Publish Result';
  unpublishText = 'Unpublish Result';
  @ViewChild('quizSearch') quizSearch!: ElementRef;
  @ViewChild('inputFile')
  inputFile!: ElementRef;
  searchSubscription!: Subscription;
  quizfile!: File;
  constructor(
    private router: Router,
    private quizService: QuizApiService,
    private dialog: MatDialog,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}
  ngOnInit(): void {
    this.refresh(this.pageNumber);
  }

  ngAfterViewInit(): void {
    this.searchSubscription = fromEvent(this.quizSearch.nativeElement, 'keyup')
      .pipe(debounceTime(1000))
      .subscribe((data: any) => {
        this.pageNumber = 0;
        this.search = data.target.value;
        this.refresh(0);
      });
  }

  refresh(page: number) {
    this.loader
      .showLoader(this.quizService.fetchAllQuizes(page, this.size, this.search))
      .subscribe({
        next: (data: { quizs: any[]; total_count: number }) => {
          this.totalElement = data.total_count;
          this.quizs = data.quizs;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  pageChange(event: any) {
    this.refresh(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  createQuiz() {
    this.router.navigateByUrl(AuthService.getModulePrefix + '/quiz-creation');
  }

  editQuiz(id: number) {
    this.router.navigate([AuthService.getModulePrefix + '/quiz-creation'], {
      queryParams: { id: id },
    });
  }

  newMapMaterial(id: number) {
    this.dialog.open(MappingPageComponent, {
      data: {
        id: id,
        mappingType: MappingType.QUIZ,
      },
      width: '100%',
      height: '99%',
    });
  }

  preview(id: number) {
    this.router.navigate([AuthService.getModulePrefix + '/quiz-preview'], {
      queryParams: { id: id },
    });
  }

  delete(id: number) {
    Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want to delete the Quiz?</p>',
      html: '',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Delete',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Delete',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.loader.showLoader(this.quizService.deleteQuiz(id)).subscribe(
          (res: any) => {
            this.alertService.successAlert(res.message);
            this.refresh(this.pageNumber);
          },
          (err) => {
            this.alertService.errorAlert('Something went wrong!');
          }
        );
      } else if (result.isDenied) {
        this.alertService.errorAlert('Quiz not deleted');
      }
    });
  }

  quizSubmitBy(id: number) {
    this.router.navigate([AuthService.getModulePrefix + '/quiz-submit-by'], {
      queryParams: { id: id },
    });
  }

  publishQuizResult(quiz: any) {
    this.quizService.publishQuizResult(quiz.id).subscribe({
      next: () => {
        quiz.published = !quiz.published;
        quiz.buttonText = quiz.published
          ? this.unpublishText
          : this.publishText;
          
        const alertMessage = 'Quiz ' + (quiz.published ? 'Published' : 'Unpublished') + ' successfully.';
        this.alertService.successAlert(alertMessage);
        
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Something went wrong!');
      },
    });
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  downloadQuizReport(id: any) {
    this.loader.showLoader(this.quizService.downloadQuizReport(id)).subscribe({
      next: (data: any) => {
        const blob = new Blob([data], { type: data.type });
        saveAs(blob, 'quiz.xlsx');
      },
      error: (error: any) => {
        this.alertService.errorAlert(error);
      },
    });
  }
  fileChangeListener(event: any): void {
    const file: File = event.target.files[0];
    if (!file.name.includes('.xlsx')) {
      alert('Please select the excel file.');
      return;
    } else {
      this.quizfile = file;
    }
  }

  uploadExcel() {
    this.loader.showLoader(
    this.quizService.uploadExcel(this.quizfile)).subscribe({
      next: (data: any) => {
       this.alertService.successAlert('Quiz uploaded successfully.')
       this.inputFile.nativeElement.value = ''; 
        this.refresh(this.pageNumber);
      },
      error: (error: any) => {
        let errorMessage = error.error.errorMessage;
        let err = errorMessage.substring(1, errorMessage.length - 1);
        const errors = err.split(',');
        this.inputFile.nativeElement.value = ''; 
        // this.alertService.errorAlert(error.error.errorMessage);
        const listHtml = errors
          .map((e: any) => `<li style="text-align: initial">${e}</li>`)
          .join('');
        Swal.fire({
          title:
            '<p style="font-weight: 700;font-size: 60.9231px;color: #FF635F;margin-bottom: -16px;margin-top: -50px;">Error!</p>',
          html: `<div style="overflow: auto; max-height: 100%; min-height: 100%; padding: 0px"><ul>${listHtml}</ul></div>`,
          imageUrl: 'assets/alerts/error.gif',
          imageWidth: 140,
          imageHeight: 140,
          imageAlt: 'Error',
          confirmButtonColor: '#FF635F',
          confirmButtonText: 'Try Again',
        });
      },
    });
  }
}

