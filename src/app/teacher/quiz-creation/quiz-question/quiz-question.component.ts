import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AssignmentDocumentPreviewComponent } from '../../../common/assignment-document-preview/assignment-document-preview.component';
import { LoaderService } from '../../../loader.service';
import { answers, questions, QuizUpdate, sections } from '../../../model/Quiz';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { AuthService } from '../../../services/auth.service';
import { QuizApiService } from '../../../services/quiz-api.service';
import Swal from 'sweetalert2';
import { QuizCropperComponent } from '../quiz-cropper/quiz-cropper.component';
import { MappingPageComponent } from '../../../common/mapping-page/mapping-page.component';
import { MappingType } from '../../../model/MappingType';

@Component({
  selector: 'app-quiz-question',
   
  templateUrl: './quiz-question.component.html',
  styleUrl: './quiz-question.component.scss'
})
export class QuizQuestionComponent implements OnInit {
  form!: FormGroup;
  now: any;
  isExamObjective: boolean = true;
  updateQuiz: QuizUpdate = new QuizUpdate();
  isSubmit: boolean = false;
  negativeMarksForQuiz: boolean = false;
  @ViewChild('fileSelect') fileSelect!: ElementRef;
  @ViewChild('answerfile') answerfile!: ElementRef;
  @ViewChild('startDate') startDate!: ElementRef;
  @ViewChild('endDate') endDate!: ElementRef;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '15rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '15rem',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    toolbarHiddenButtons: [['insertImage', 'insertVideo']],
  };
  filesToBeUploaded = new Map<string, File>();
  isUpdate: boolean = false;
  minutesError: boolean = false;
  hourOptions: Array<number | string> = [ ...Array.from({ length: 12 }, (_, i) => i + 1)];
  minuteOptions: Array<number | string> = [ ...Array.from({ length: 60 }, (_, i) => i)];
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private quizApiService: QuizApiService,
    private activatedRoute: ActivatedRoute,
    private loader: LoaderService,
    private location: Location,
    private alertService: SwalAlertService,

  ) { }
  ngOnInit(): void {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'YYYY-MM-ddTHH:MM');
    this.fetchQuiz();
  }

  fetchQuiz() {
    this.createForm();
    if (this.activatedRoute.snapshot.queryParamMap.get('id')) {
      this.isUpdate = true;
      this.quizApiService
        .fetchQuiz(this.activatedRoute.snapshot.queryParamMap.get('id'))
        .subscribe({
          next: (data: QuizUpdate) => {
            this.updateQuiz = data;
            this.updateForm();
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.errorAlert('Internal Server Error');
          },
        });
    }
  }

  updateForm() {
    this.form = this.fb.group({
      id: [this.updateQuiz?.id],
      name: [this.updateQuiz?.name, Validators.required],
      examType: ['objective', Validators.required],
      marks: [this.updateQuiz?.marks, Validators.required],
      hour: [this.updateQuiz?.hour, Validators.required],
      minutes: [this.updateQuiz?.minutes, Validators.required],
      startTime: [this.updateQuiz?.startTime, Validators.required],
      endTime: [this.updateQuiz?.endTime, Validators.required],
      negtiveMarking: [this.updateQuiz?.negtiveMarking, [Validators.required]],
      negtiveMarks: [this.updateQuiz?.negtiveMarks],
      sections: this.fb.array([]),
    });
    this.updateQuiz.sections.forEach((value: sections) =>
      this.editSection(value)
    );
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.updateQuiz?.id],
      name: [
        this.updateQuiz?.name,
        [Validators.required, this.validateCharctersInput],
      ],
      examType: ['objective', Validators.required],
      marks: [
        this.updateQuiz?.marks,
        [Validators.required, this.validateDigitInput],
      ],
      hour: [this.updateQuiz?.hour, Validators.required],
      minutes: [this.updateQuiz?.minutes, Validators.required],
      startTime: [this.updateQuiz?.startTime, Validators.required],
      endTime: [this.updateQuiz?.endTime, Validators.required],
      negtiveMarking: [this.updateQuiz?.negtiveMarking, [Validators.required]],
      negtiveMarks: [this.updateQuiz?.negtiveMarks],
      sections: this.fb.array([this.createSectionItem()]),
    });
  }

  createSectionItem(dislayOrder?: number) {
    return this.fb.group({
      id: [''],
      sectionTitle: ['', [Validators.required, this.validateCharctersInput]],
      sectionDescription: [''],
      displayOrder: [dislayOrder ? dislayOrder : 1, [Validators.required]],
      questions: this.fb.array([this.createQuestionItem()]),
    });
  }

  createQuestionItem(displayOrder?: number) {
    return this.fb.group({
      id: [''],
      questionTitle: ['', [Validators.required]],
      questionType: ['objective'],
      questionImage: [''],
      displayOrder: [displayOrder ? displayOrder : 1, [Validators.required]],
      marks: ['', [Validators.required]],
      answers: this.fb.array(this.createDefaultOptions()),
    });
  }

  createSingleQuestionItem(displayOrder: number) {
    return this.fb.group({
      id: [''],
      questionTitle: ['', [Validators.required]],
      questionType: ['objective'],
      questionImage: ['', [Validators.required]],
      displayOrder: [displayOrder, [Validators.required]],
      marks: ['', [Validators.required]],
      answers: this.fb.array(this.createDefaultOptions()),
    });
  }

  createDefaultOptions() {
    let arr: any[] = [
      this.fb.group({
        id: [''],
        optionTitle: ['', [Validators.required]],
        optionType: ['text'],
        optionImage: [''],
        right: [false],
      }),
      this.fb.group({
        id: [''],
        optionTitle: ['', [Validators.required]],
        optionType: ['text'],
        optionImage: [''],
        right: [false],
      }),
      this.fb.group({
        id: [''],
        optionTitle: ['', [Validators.required]],
        optionType: ['text'],
        optionImage: [''],
        right: [false],
      }),
      this.fb.group({
        id: [''],
        optionTitle: ['', [Validators.required]],
        optionType: ['text', [Validators.required]],
        optionImage: [''],
        right: [false],
      }),
    ];
    return arr;
  }
  validateDigitInput(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value.length > 4) {
      return { validateDigitInput: true };
    }
    return null;
  }
  validateCharctersInput(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length > 25) {
      return { validateCharctersInput: true };
    }
    return null;
  }
  validateQuestionCharctersInput(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length > 65) {
      return { validateQuestionCharctersInput: true };
    }
    return null;
  }
  editSection(module: any) {
    const control = <FormArray>this.form.get('sections');
    control.push(
      this.fb.group({
        id: [module.id],
        sectionTitle: [module.sectionTitle, [Validators.required]],
        displayOrder: [module.displayOrder, [Validators.required]],
        sectionDescription: [module.sectionDescription],
        questions: this.fb.array([
          ...module.questions.map((item: any) => this.editQuestion(item)),
        ]),
      })
    );
  }
  editQuestion(module: any) {
    return this.fb.group({
      id: [module.id],
      questionTitle: [module.questionTitle, [Validators.required]],
      displayOrder: [module.displayOrder, [Validators.required]],
      questionType: [module.questionType, [Validators.required]],
      questionImage: [module.questionImage],
      questionImagePath: [module.questionImagePath],
      marks: [module.marks, [Validators.required]],
      // right:[false,module.isRight],
      answers: this.fb.array([
        ...module.answers.map((item: any) => this.editanswers(item)),
      ]),
    });
  }
  editanswers(module: any) {
    return this.fb.group({
      id: [module.id],
      optionTitle: [
        module.optionTitle,
        module.optionImagePath ? [] : [Validators.required],
      ],
      optionImage: [module.optionImage],
      optionType: [module.optionType],
      optionImagePath: [module.optionImagePath],
      right: [module.right],
    });
  }

  isNegtiveMarksForQuiz(value: any) {
    if (value == 'true') {
      this.negativeMarksForQuiz = true;
      this.form?.get('negativeMarks')?.setValidators([Validators.required]);
      this.form?.get('negativeMarks')?.updateValueAndValidity();
      return;
    }
    this.negativeMarksForQuiz = false;
    this.form?.get('negativeMarks')?.clearValidators();
    this.form?.get('negativeMarks')?.updateValueAndValidity();
  }

  get controls() {
    return this.form.controls;
  }

  get getSectionControls() {
    return (this.form.controls['sections'] as FormArray).controls;
  }

  getSections() {
    return (this.form.controls['sections'] as FormArray).controls;
  }

  getQuestions(form: any) {
    return (form.controls['questions'] as FormArray).controls;
  }
  getanswers(form: any) {
    return (form.controls['answers'] as FormArray).controls;
  }

  addSection() {
    const control = <FormArray>this.form.get('sections');
    control.push(this.createSectionItem(control.length + 1));
  }

  removeSection(i: number) {
    const control = <FormArray>this.form.get('sections');
    const id = control.value[i]?.id;
    if (id) {
      Swal.fire({
        title:
          '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
          'Do you want to delete the Section?</p>',
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
      }).then((result: { isConfirmed: any; isDenied: any; }) => {
        if (result.isConfirmed) {
          this.quizApiService.deleteSection(id).subscribe({
            next: (res: any) => {
              this.alertService.successAlert(res.message);
              control.removeAt(i);
            },
            error: (err: HttpErrorResponse) => {
              this.alertService.errorAlert('Something went wrong!');
            },
          });
        } else if (result.isDenied) {
          this.alertService.errorAlert('Section not deleted');
        }
      });
      return;
    }
    control.removeAt(i);
  }

  addQuestion(section: any) {
    const question = section.controls['questions'] as FormArray;
    question.push(this.createQuestionItem(question.length + 1));
  }

  removeQuestion(section: any, index: number) {
    const questions = this.getQuestions(section);
    const id = questions[index].value.id;
    if (id) {
      Swal.fire({
        title:
          '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
          'Do you want to delete the Question?</p>',
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
      }).then((result: { isConfirmed: any; isDenied: any; }) => {
        if (result.isConfirmed) {
          this.quizApiService.deleteQuestion(id).subscribe({
            next: (res: any) => {
              this.alertService.successAlert(res.message);
              questions.splice(index, 1);
            },
            error: (err: HttpErrorResponse) => {
              this.alertService.errorAlert('Something went wrong!');
            },
          });
        } else if (result.isDenied) {
          this.alertService.errorAlert('Question not deleted');
        }
      });
      return;
    }
    questions.splice(index, 1);
  }

  addOption(question: any) {
    const answers = question.controls['answers'] as FormArray;
    answers.push(this.createSingleOption());
  }

  removeOption(question: any, index: number) {
    const answers = this.getanswers(question);
    const id = answers[index].value.id;
    if (id) {
      Swal.fire({
        title:
          '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
          'Do you want to delete the Option?</p>',
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
      }).then((result: { isConfirmed: any; isDenied: any; }) => {
        if (result.isConfirmed) {
          this.quizApiService.deleteOption(id).subscribe({
            next: (res: any) => {
              this.alertService.successAlert(res.message);
              answers.splice(index, 1);
            },
            error: (err: HttpErrorResponse) => {
              this.alertService.errorAlert('Something went wrong!');
            },
          });
        } else if (result.isDenied) {
          this.alertService.errorAlert('Option not deleted');
        }
      });
      return;
    }
    answers.splice(index, 1);
  }

  createSingleOption() {
    return this.fb.group({
      id: [''],
      optionTitle: ['', [Validators.required]],
      optionType: ['text'],
      optionImage: [''],
      right: [false],
    });
  }

  isFileImage(file: File) {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type']);
  }

  onQuestionFileChange(event: any, i: number, j: number) {
    let file: File = event.target.files[0];
    if (!this.isFileImage(file)) {
      this.alertService.errorAlert('Please select image.');
      return;
    }
    if (file.size > 5242880) {
      this.alertService.errorAlert('Default image file size is 5 MB');
      this.fileSelect.nativeElement.value = '';
      return;
    }
    const dialogRef = this.dialog.open(QuizCropperComponent, {
      data: { event: event },
    });
    dialogRef.afterClosed().subscribe((file: File | undefined) => {
      if (file) {
        let newFileName =
          this.randomString(6).replace(/\s/g, '') +
          file.name.replace(/\s/g, '');
        const control = <FormGroup>(
          this.form.get(['sections', i, 'questions', j])
        );
        control.get('questionImage')?.setValue(newFileName);
        control.get('questionType')?.setValue('image');
        this.filesToBeUploaded.set(newFileName, file);
      }
      const element = document.getElementById(
        ('ques' + i + j).toString()
      ) as HTMLInputElement;
      element.value = '';
    });
  }

  randomString(length: number) {
    var randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }

  onOptionFileChange(event: any, i: number, j: number, k: number) {
    const file: File = event.target.files[0];
    if (!this.isFileImage(file)) {
      this.alertService.errorAlert('Please select image.');
      return;
    }
    if (file.size > 5242880) {
      this.alertService.errorAlert('Default image file size is 5 MB');
      this.fileSelect.nativeElement.value = '';
      return;
    }
    const control = <FormGroup>(
      this.form.get(['sections', i, 'questions', j, 'answers', k])
    );
    const dialogRef = this.dialog.open(QuizCropperComponent, {
      data: { event: event },
    });
    dialogRef.afterClosed().subscribe((file: File | undefined) => {
      if (file) {
        let newFileName =
          this.randomString(6).replace(/\s/g, '') +
          file.name.replace(/\s/g, '');
        control.get('optionImage')?.setValue(newFileName);
        control.get('optionType')?.setValue('image');
        control.get('optionTitle')?.setValue('');
        const optTitle = control.get('optionTitle');
        optTitle?.setValue('');
        optTitle?.removeValidators(Validators.required);
        optTitle?.updateValueAndValidity();
        this.filesToBeUploaded.set(newFileName, file);
        return;
      }
      const element = document.getElementById(
        ('opt' + i + j + k).toString()
      ) as HTMLInputElement;
      element.value = '';
    });
  }

  updateOptionValue(question: any, i: number) {
    (question.controls['answers'] as FormArray).controls.forEach(
      (currentValue: any, index: number) => {
        if (index == i) {
          currentValue.get('right')?.setValue(true);
        } else {
          currentValue.get('right')?.setValue(false);
        }
      }
    );
  }
  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  removeQuestionImage(name: string, i: number, j: number) {
    this.filesToBeUploaded.delete(name);
    const control = <FormGroup>this.form.get(['sections', i, 'questions', j]);
    control.get('questionType')?.setValue('objective');
    const element = document.getElementById(
      ('ques' + i + j).toString()
    ) as HTMLInputElement;
    element.value = '';
    if (control.get('id')?.value && control.get('questionImagePath')?.value)
      this.removeQuizImages(control.get('id')?.value, 'question');
    control.get('questionImage')?.setValue('');
    control.get('questionImagePath')?.setValue('');
  }

  removeQuizImages(id: number, type: string) {
    this.quizApiService.deleteQuizImages(id, type).subscribe({
      next: (data: any) => { },
      error: (error: HttpErrorResponse) => { },
    });
  }

  removeOptionImage(name: string, i: number, j: number, k: number) {
    this.filesToBeUploaded.delete(name);
    const control = <FormGroup>(
      this.form.get(['sections', i, 'questions', j, 'answers', k])
    );
    control.get('optionType')?.setValue('text');
    const element = document.getElementById(
      ('opt' + i + j + k).toString()
    ) as HTMLInputElement;
    element.value = '';
    const optTitle = control.get('optionTitle');
    optTitle?.addValidators(Validators.required);
    optTitle?.updateValueAndValidity();
    if (control.get('id')?.value && control.get('optionImagePath')?.value)
      this.removeQuizImages(control.get('id')?.value, 'option');
    control.get('optionImage')?.setValue('');
    control.get('optionImagePath')?.setValue('');
  }

  base64Preview(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const filePath = reader.result as string;
      this.showPreview(filePath, false);
    };
  }

  preview(image: string) {
    if (!this.isUpdate) {
      const file = this.filesToBeUploaded.get(image);
      if (file) {
        this.base64Preview(file);
      }
      return;
    }
    const file = this.filesToBeUploaded.get(image);
    file
      ? this.base64Preview(file)
      : this.showPreview(
        'https://nrichvideo.s3.ap-south-1.amazonaws.com/' + image,
        false
      );
  }

  showPreview(path: string, isPdf: boolean) {
    const dialogRef = this.dialog.open(AssignmentDocumentPreviewComponent, {
      position: { top: '20px' },
      maxHeight: '650px',
      width: '1000px',
      data: {
        imgUrl: path,
        isPdf: isPdf,
      },
      hasBackdrop: true,
      panelClass: ['animate__animated', 'animate__backInDown'],
    });
    dialogRef.afterClosed().subscribe((result: any) => { });
  }

  submit() {
    this.isSubmit = true;
    if(this.minutesError == true){
      return;
    }
    
    if (this.form.get('startTime')?.value > this.form.get('endTime')?.value) {
      this.alertService.errorAlert('Start time should not be greater than End time');
      return;
    }
  
    if (this.form.get('negtiveMarking')?.value == 'true') {
      this.form.get('negtiveMarks')?.addValidators(Validators.required);
      this.form.get('negtiveMarks')?.updateValueAndValidity();
    } else {
      this.form.get('negtiveMarks')?.removeValidators(Validators.required);
      this.form.get('negtiveMarks')?.updateValueAndValidity();
    }
    
    if (this.form.invalid) {
      return;
    }
    let marks = 0;
    this.updateQuiz = this.form.value as QuizUpdate;
    this.updateQuiz.sections.forEach((section: sections) => {
      section.questions.forEach((question: questions) => {
        marks = marks + +question.marks;
        if (!question.answers.some((value: answers) => value.right == true)) {
          this.alertService.okErrorAlert(
            'Answer is missing for this question (' +
            question.questionTitle +
            ')'
          );
          throw Error('Answer missing');
        }
      });
    });
    if (this.updateQuiz.hour == 0 && this.updateQuiz.minutes < 5) {
      this.alertService.okErrorAlert(
        'Exam duration must be greater than or equal to five minute.'
      );
      return;
    }
 
    if (marks == this.updateQuiz.marks) {
      this.updateQuiz.instituteId = +AuthService.getInstituteId;
      this.loader
        .showLoader(
          this.quizApiService.saveQuiz(this.updateQuiz, this.filesToBeUploaded)
        )
        .subscribe({
          next: (data: any) =>{
              if (this.isUpdate)
              this.alertService.successAlert('Quiz updated successfully');
            else this.alertService
            .buttonSuccessAlert('Quiz created successfully!', 'Map To Batch')
            .then((result) => {
              if (result.isConfirmed) {
                this.dialog.open(MappingPageComponent, {
                  data: {
                    id: data,
                    mappingType: MappingType.QUIZ,
                  },
                  width: '100%',
                  height: '99%',
                });
              }
            });
            this.location.back();
          },
            
          error: (error: HttpErrorResponse) => {
            // this.alertService.errorAlert(error.error.message);
            this.alertService.errorAlert("Something went wrong!");
          },
        });
      return;
    }
    Swal.fire(
      'The Marks?',
      'Total Question Marks should  be equal to total marks',
      'question'
    );
  }

  maximumMinutesCheck(newValue: any) {
    if (newValue > 59) {
      this.minutesError = true;
    } else {
      this.minutesError = false;
    }
  }

  showPicker(isStartDateClick:boolean){
    if(isStartDateClick) this.startDate.nativeElement.showPicker()
    else this.endDate.nativeElement.showPicker()

  }
}
