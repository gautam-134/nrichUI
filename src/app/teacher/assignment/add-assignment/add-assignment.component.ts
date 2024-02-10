import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import moment from 'moment';
import { AssignmentDocumentPreviewComponent } from '../../../common/assignment-document-preview/assignment-document-preview.component';
import { MappingPageComponent } from '../../../common/mapping-page/mapping-page.component';
import { LoaderService } from '../../../loader.service';
import { assignmentVO } from '../../../model/assignmentVO';
import { MappingType } from '../../../model/MappingType';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { AssignmentService } from '../../../services/assignment/assignment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-assignment',
   
  templateUrl: './add-assignment.component.html',
  styleUrl: './add-assignment.component.scss'
})
export class AddAssignmentComponent implements OnInit {
  form!: FormGroup;
  now: any;
  maxmarksField: boolean = false;
  assignmentVO: assignmentVO = new assignmentVO();
  allowedFileType: string[] = ['image/jpeg', 'image/png', 'application/pdf'];
  refresh = new EventEmitter<boolean>();
  @ViewChild('selectFiles') selectFilesInput!: ElementRef;
  file: any;
  filesList: File[] = [];
  isSubmit: boolean = false;
  htmlContent = '';
  @ViewChild('publishDate') publishDate!: ElementRef;
  @ViewChild('submitdate') submitdate!: ElementRef;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['foregroundColorPicker','backgroundColorPicker']],
    fonts: [{ class: 'poppins', name: 'Poppins' }],
  };
  constructor(
    private fb: FormBuilder,
    private loader: LoaderService,
    private assignmentService: AssignmentService,
    private dialog: MatDialog,
    private _location: Location,
    private el: ElementRef,
    private alertService: SwalAlertService,
    @Inject(MAT_DIALOG_DATA)
    public data: { body: assignmentVO; isEdit: boolean; instituteId: number }
  ) {}

  @ViewChild('fileSelect') fileSelect!: ElementRef;
  ngOnInit(): void {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    if (this.data.isEdit) {
      this.htmlContent = this.data.body.description;
      this.form = this.fb.group({
        name: [
          this.data.body.name,
          [Validators.required, this.validateCharctersInput],
        ],
        description: [this.data.body.description],
        submissiontype: [this.data.body.submissiontype],
        gradeType: [this.data.body.gradeType],
        maxMarks: [this.data.body.maxMarks],
        submitDate: [
          moment(this.data.body.submissionFrom).utc().format('YYYY-MM-DD'),
          Validators.required,
        ],
        publishedDate: [
          moment(this.data.body.publishedDate).utc().format('YYYY-MM-DD'),
          Validators.required,
        ],
        uploadedFiles: [this.data.body.uploadedFiles],
      });
    } else
      this.form = this.fb.group({
        name: ['', [Validators.required, this.validateCharctersInput]],
        description: [''],
        submissiontype: [''],
        gradeType: [''],
        maxMarks: [''],
        submitDate: [''],
        publishedDate: [''],
        uploadedFiles: [''],
      });
  }
  get controls() {
    return this.form.controls;
  }

  onFileChange(event: any) {
    let invalidFilesName: string[] = [];
    for (var i = 0; i < event.target.files.length; i++) {
      if (!this.allowedFileType.includes(event.target.files[i].type)) {
        invalidFilesName.push(event.target.files[i].name);
      } else {
        if (this.isFilePDF(event.target.files[i])) {
          if (event.target.files[i].size > 15728640) {
            this.alertService.errorAlert(
              'Pdf size should not be greater than 15 MB'
            );
            this.fileSelect.nativeElement.value = '';
            return;
          } else {
            this.filesList.push(event.target.files[i]);
          }
        } else {
          if (event.target.files[i].size > 5242880) {
            this.alertService.errorAlert(
              'Image size should not be greater than 5 MB'
            );
            this.fileSelect.nativeElement.value = '';
            return;
          } else {
            this.filesList.push(event.target.files[i]);
          }
        }
      }
    }
    if (invalidFilesName.length != 0) {
      this.alertService.okErrorAlert(
        'Format of these files ' +
          invalidFilesName.toString() +
          ' Are Not Allowed.'
      );
    }
  }

  deleteFilesFromList(index: number) {
    this.filesList.splice(index, 1);
    if (this.filesList.length == 0) {
      this.selectFilesInput.nativeElement.value = '';
    }
  }
  isFilePDF(file: any) {
    const acceptedImageTypes = ['application/pdf'];
    return file && acceptedImageTypes.includes(file['type']);
  }

  isFileImage(file: any) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type']);
  }
  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl: HTMLElement =
            this.el.nativeElement.querySelector(
              '[formcontrolname="' + key + '"]'
            );
          invalidControl.focus();
          break;
        }
      }
      return;
    }
    // if (this.filesList.length == 0) {
    //   this.updateAssignment();
    //   return;
    // }
    if (
      this.form.value.gradeType == 'number' &&
      this.form.value.maxMarks == ''
    ) {
      Swal.fire('Please enter Maximum Marks');
    }
    this.createAssignment(this.filesList);
  }

  createAssignment(fileName: File[]) {
    (this.assignmentVO.id = this.data.isEdit
      ? this.data.body.id
      : (' ' as unknown as number)),
      (this.assignmentVO.name = this.form.value.name),
      (this.assignmentVO.description = this.form.value.description),
      (this.assignmentVO.gradeType = this.form.value.gradeType),
      (this.assignmentVO.submissiontype = this.form.value.submissiontype),
      (this.assignmentVO.maxMarks = this.form.value.maxMarks),
      (this.assignmentVO.instituteId = this.data.instituteId);
    this.assignmentVO.submissionFrom = this.form.value.submitDate;
    this.assignmentVO.publishedDate = this.form.value.publishedDate;
    if (this.data.isEdit)
      this.assignmentVO.uploadedFiles = this.data.body.uploadedFiles;
    this.loader
      .showLoader(
        this.assignmentService.createAssignment(this.assignmentVO, fileName)
      )
      .subscribe({
        next: (res: any) => {
          this.alertService
            .buttonSuccessAlert(
              'Assignment Created Successfully!',
              'Map To Batch'
            )
            .then((result) => {
              if (result.isConfirmed) {
                this.dialog.open(MappingPageComponent, {
                  data: {
                    id: res,
                    mappingType: MappingType.ASSIGNMENT,
                  },
                  width: '100%',
                  height: '99%',
                });
              } else {
                // this._location.back();
              }
            });
          this.refresh.emit(true);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
        },
      });
  }
  validateCharctersInput(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length > 35) {
      return { validateCharctersInput: true };
    }
    return null;
  }
  updateAssignment() {
    (this.assignmentVO.id = this.data.isEdit
      ? this.data.body.id
      : (' ' as unknown as number)),
      (this.assignmentVO.name = this.form.value.name),
      (this.assignmentVO.description = this.form.value.description),
      (this.assignmentVO.gradeType = this.form.value.gradeType),
      (this.assignmentVO.submissiontype = this.form.value.submissiontype),
      (this.assignmentVO.uploadedFiles = this.data.body.uploadedFiles),
      (this.assignmentVO.maxMarks = this.form.value.maxMarks),
      (this.assignmentVO.instituteId = this.data.instituteId);
    this.assignmentVO.submissionFrom = this.form.value.submitDate;
    this.assignmentVO.publishedDate = this.form.value.publishedDate;
    this.loader
      .showLoader(
        this.assignmentService.createAssignment(this.assignmentVO, [])
      )
      .subscribe({
        next: (res: any) => {
          this.alertService
            .buttonSuccessAlert(
              'Assignment Updated Successfully!',
              'Map To Batch'
            )
            .then((result) => {
              if (result.isConfirmed) {
                this.dialog.open(MappingPageComponent, {
                  data: {
                    id: res,
                    mappingType: MappingType.ASSIGNMENT,
                  },
                  width: '100%',
                  height: '99%',
                });
              } else {
                this._location.back();
              }
            });
          this.refresh.emit(true);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert(error.error.message);
        },
      });
  }

  selectInput(gradeType: string) {
    if (gradeType == 'number') {
      this.maxmarksField = true;
    } else this.maxmarksField = false;
  }

  documentPreview(file: File | string): void {
    let filePath = file;
    if (typeof file != 'string') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        filePath = reader.result as string;
        this.preview(filePath, file.type == 'application/pdf' ? true : false);
      };
    } else {
      this.preview(file, file.includes('.pdf') ? true : false);
    }
  }

  deleteUploadedFiles(i: number) {
    this.data.body.uploadedFiles.splice(i, 1);
  }

  preview(path: string, isPdf: boolean) {
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
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  showPicker(isStartDateClick:boolean){
    if(isStartDateClick) this.publishDate.nativeElement.showPicker()
    else this.submitdate.nativeElement.showPicker()

  }
}
