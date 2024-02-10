import { Location } from '@angular/common';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PreviewComponent } from '../../../common/file-management/preview/preview.component';
import { MappingPageComponent } from '../../../common/mapping-page/mapping-page.component';
import { LoaderService } from '../../../loader.service';
import { ApiResponse } from '../../../model/ApiResponse';
import { MappingType } from '../../../model/MappingType';
import { UploadMaterial } from '../../../model/UploadMaterial';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { InstituteService } from '../../../services/institute/institute.service';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-material',
   
  templateUrl: './add-material.component.html',
  styleUrl: './add-material.component.scss'
})
export class AddMaterialComponent implements OnInit {
  materialId!: number;
  materialFilePath!: string;
  materialFileName: string | undefined = '';
  form!: FormGroup;
  materialModule: UploadMaterial = new UploadMaterial();
  isSubmit: boolean = false;
  hasError: boolean = false;
  file: File | undefined;
  filesList: File[] = [];
  progressValue: any;
  disableBtn: boolean = false;
  @ViewChild('fileSelect') fileSelect!: ElementRef;
  filePath: string = '';
  videoTypes: string[] = ['mp4', 'mov', 'avi', 'mkv'];
  imageTypes: string[] = ['jpeg', 'jpg', 'png'];
  audioTypes: string[] = ['mp3'];
  otherTypes: string[] = ['pdf'];
  new!: { value: string }[];
  progress: number | undefined;
  vacentSpace: number | undefined;
  constructor(
    private fb: FormBuilder,
    private instituteService: InstituteService,
    private loader: LoaderService,
    private location: Location,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private alertService: SwalAlertService
  ) { }

  ngOnInit(): void {
    this.fetchVacentSpace();
    this.materialId = this.activatedRoute.snapshot.queryParams['id'];
    this.refresh();
    if (this.materialId) {
      this.loader
        .showLoader(this.instituteService.fetchClassMaterial(this.materialId))
        .subscribe({
          next: (res: any) => {
            this.materialModule.materialTopic = res.materialTopic;
            this.materialModule.materialType = res.materialType;
            if (res.metaTags != null) {
              this.new = res.metaTags.map(function (e: any) {
                return { display: e, value: e };
              });
            }
            this.materialModule.materialFileName = res.materialFileName;
            this.materialFilePath = res.materialFilePath;
            this.materialFileName = res.materialFileName;
          },
          error: (err: any) => {
            this.alertService.errorAlert(
              'Error while fetching material details'
            );
          },
        });
    }
  }

  fetchVacentSpace() {
    this.instituteService.fetchVacentSpace().subscribe({
      next: (data: ApiResponse) => {
        this.vacentSpace = data.body;
      },
    });
  }

  refresh() {
    this.form = this.fb.group({
      materialType: ['', Validators.required],
      materialTopic: [
        '',
        [
          Validators.required,
          this.validateCharctersInput,
          this.validateInputWords,
        ],
      ],
      metaTags: ['', Validators.required],
    });
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    if (this.filesList.length == 0 && !this.materialId) {
      this.hasError = true;
      return;
    }
    if (this.file?.size && this.vacentSpace && this.vacentSpace < this.file.size) {
      this.alertService.okErrorAlert('Not enough space.');
      return;
    }
    this.materialModule.idTeacher = JSON.parse(
      localStorage.getItem('auth') || '{}'
    ).user_id;
    let selectedInstitute = Number.parseInt(
      JSON.parse(localStorage.getItem('auth') || '{}').selectedInstitute
    );
    this.materialModule.idInstitution = selectedInstitute;
    this.materialModule.metaTags = this.new.map(function (a) {
      return a['value'];
    });
    if (this.materialId) {
      this.materialModule.idClassMaterial = this.materialId;
    }
    this.disableBtn = !this.disableBtn;
    this.instituteService
      .uploadMaterial(this.materialModule, this.filesList)
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            let total = event.total ? event.total : 0;
            this.progress = Math.round((100 * event.loaded) / total);
          } else if (event instanceof HttpResponse) {
            this.disableBtn = !this.disableBtn;
            this.progress = undefined;
            this.location.back();
            this.alertService
              .buttonSuccessAlert(event.body.message, 'Map To Batch')
              .then((result: any) => {
                if (result.isConfirmed) {
                  this.dialog.open(MappingPageComponent, {
                    data: {
                      id: event.body.body,
                      mappingType: MappingType.MATERIAL,
                    },
                    width: '100%',
                    height: '99%',
                  });
                }
              });
          }
        },
        error: (error: any) => {
          this.disableBtn = !this.disableBtn;
          this.progress = undefined;
          if (error.status == 507) {
            this.alertService.errorAlert(
              'Your Bucket thresshold limit is exceeded'
            );
          } else {
            this.alertService.errorAlert(error.error.message);
          }
        },
      });
  }

  documentPreview(file?: File): void {
    const type = file
      ? this.getFileType(file.name)
      : this.getFileType(this.materialFilePath);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const filePath = reader.result as string;
        this.showPreview(filePath, type);
      };
      return;
    }
    this.showPreview(this.materialFilePath, type);
  }

  showPreview(key: string, type: string) {
    const filePath = this.filePath + key;
    this.dialog.open(PreviewComponent, {
      maxWidth: '800px',
      data: {
        path: filePath,
        type: type,
      },
    });
  }

  getFileType(filePath: string) {
    return this.imageTypes.includes(
      filePath.substring(filePath.lastIndexOf('.') + 1)
    )
      ? 'image'
      : this.videoTypes.includes(
        filePath.substring(filePath.lastIndexOf('.') + 1)
      )
        ? 'video'
        : this.audioTypes.includes(
          filePath.substring(filePath.lastIndexOf('.') + 1)
        )
          ? 'audio'
          : this.otherTypes.includes(
            filePath.substring(filePath.lastIndexOf('.') + 1)
          )
            ? 'pdf'
            : 'other';
  }
  validateCharctersInput(
    control: AbstractControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length > 28) {
      return { validateCharctersInput: true };
    }
    return null;
  }

  validateInputWords(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value.split(' ').length > 5) {
      return { validateInputWords: true };
    }
    return null;
  }
  onFileChange($event: any) {
    this.file = undefined;
    this.materialFileName = '';
    if (!this.materialModule.materialType) {
      this.fileSelect.nativeElement.value = '';
      alert('Please Select the Type of File You want to select.');
      return;
    }
    this.hasError = false;
    let filesSize = 0;

    if(this.materialId) {
      this.filesList = [];
    }

    for (var i = 0; i < $event.target.files.length; i++) {
      let file = $event.target.files[i];
      if (this.form.get('materialType')?.value != this.getFileType(file.name)) {
        alert(
          'Your selected material type and uploaded file type is not same.'
        );
        this.filesList = [];
        this.fileSelect.nativeElement.value = '';
        filesSize = 0;
        return;
      }
      filesSize += file.size;
    }

    for (var i = 0; i < $event.target.files.length; i++) {
      let file = $event.target.files[i];
      if (this.materialModule.materialType == 'video') {
        if (this.isFileVedio(file)) {
          if (filesSize > 4294967296) {
            this.alertService.errorAlert(
              'Video size should not be greater than 4 GB'
            );
            this.fileSelect.nativeElement.value = '';
            this.filesList = [];
            this.file = undefined;
            return;
          } else {
            this.file = file;
            this.filesList.push(file);
          }
        } else {
          this.fileSelect.nativeElement.value = '';
          alert('Please select video or change material type.');
          this.filesList = [];
          return;
        }
      }
      if (this.materialModule.materialType == 'image') {
        if (this.isFileImage(file)) {
          if (!file.name.includes('.jfif')) {
            if (filesSize > 5242880) {
              this.alertService.errorAlert(
                'Image size should not be greater than 5 Mb'
              );
              this.fileSelect.nativeElement.value = '';
              this.file = undefined;
              this.filesList = [];
              return;
            } else {
              this.file = file;
              this.filesList.push(file);
            }
          } else {
            this.fileSelect.nativeElement.value = '';
            this.alertService.okErrorAlert('.jfif file format is Not Allowed.');
            this.filesList = [];
            return;
          }
        } else {
          this.fileSelect.nativeElement.value = '';
          alert('Please select image or change material type.');
          this.filesList = [];
          return;
        }
      }

      if (this.materialModule.materialType == 'pdf') {
        if (this.isFilePDF(file)) {
          if (filesSize > 104857600) {
            this.alertService.errorAlert(
              'Pdf size should not be greater than 100 MB'
            );
            this.file = undefined;
            this.fileSelect.nativeElement.value = '';
            this.filesList = [];
            return;
          } else {
            this.file = file;
            this.filesList.push(file);
          }
        } else {
          this.fileSelect.nativeElement.value = '';
          alert('Please select pdf file or change material type.');
          this.filesList = [];
          return;
        }
      }
      if (this.materialModule.materialType == 'audio') {
        if (this.isFileAudio(file)) {
          if (file.size > 104857600) {
            this.alertService.errorAlert(
              'Audio size should not be greater than 100 MB'
            );
            this.file = undefined;
            this.fileSelect.nativeElement.value = '';
            this.filesList = [];
            return;
          } else {
            this.file = file;
            this.filesList.push(file);
            // this.fileSelect.nativeElement.value = '';
          }
        } else {
          this.fileSelect.nativeElement.value = '';
          alert('Please select audio file or change material type.');
          this.filesList = [];
          return;
        }
      }
    }

  }

  deleteFilesFromList(index: number) {
    this.filesList.splice(index, 1);
    if (this.filesList.length == 0) {
      this.fileSelect.nativeElement.value = '';
      this.file=undefined
      this.materialFileName=this.materialModule.materialFileName
    }
  }

  isFileExcel(file: any) {
    const acceptedVideoTypes = ['text/csv', 'text/xls', 'text/xls'];
    return file && acceptedVideoTypes.includes(file['type']);
  }
  isFileVedio(file: any) {
    const acceptedVideoTypes = ['video/mp4', 'video/ogg'];
    return file && acceptedVideoTypes.includes(file['type']);
  }
  isFileAudio(file: any) {
    const acceptedAudioTypes = ['audio/mpeg'];
    return file && acceptedAudioTypes.includes(file['type']);
  }
  isFileImage(file: any) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type']);
  }
  isFilePpt(file: any) {
    const acceptedVideoTypes = ['application/vnd.ms-powerpoint'];
    return file && acceptedVideoTypes.includes(file['type']);
  }

  isFilePDF(file: any) {
    const acceptedImageTypes = ['application/pdf'];
    return file && acceptedImageTypes.includes(file['type']);
  }

  isFileMsword(file: any) {
    if (
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'.includes(
        file.type
      )
    )
      return true;
    return false;
  }

  get controls() {
    return this.form.controls;
  }

  back() {
    this.location.back();
  }
}
