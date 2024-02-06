import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  MaterialUploadingCount,
  PrerecordedMaterialVO,
} from 'src/app/model/PrerecordedModels';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { FileCheckService } from 'src/app/services/file-check.service';
import { PreRecordedModuleService } from 'src/app/services/pre-recorded-module.service';

@Component({
  selector: 'app-prerecorded-materials',
  standalone: true,
  imports: [],
  templateUrl: './prerecorded-materials.component.html',
  styleUrl: './prerecorded-materials.component.scss'
})
export class PrerecordedMaterialsComponent implements OnInit, OnDestroy {
  materialForm!: FormGroup;
  file: File | undefined;
  @Input('id') sectionId!: number;
  prerecordedMaterialVO = new PrerecordedMaterialVO();
  submit: boolean = false;
  @ViewChild('fileSelect') fileSelect!: ElementRef;
  subscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private alertService: SwalAlertService,
    private fileCheck: FileCheckService,
    private http: PreRecordedModuleService
  ) {}
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  subscribeIsMaterialUpdated() {
    this.subscription = this.http.isMaterialUpdatedOrAdded.subscribe(
      (data: PrerecordedMaterialVO | undefined) => {
        if (
          data &&
          data.prerecordedSectionId == this.sectionId &&
          data.progress != 'uploaded'
        ) {
          this.prerecordedMaterialVO = data;
          this.createForm();
        }
      }
    );
  }

  ngOnInit(): void {
    this.createForm();
    this.subscribeIsMaterialUpdated();
  }

  createForm() {
    this.materialForm = this.fb.group(
      {
        id: [this.prerecordedMaterialVO?.id],
        name: [this.prerecordedMaterialVO?.name, [Validators.required]],
        description: [
          this.prerecordedMaterialVO?.description,
          [Validators.required],
        ],
        displayOrder: [
          this.prerecordedMaterialVO?.displayOrder,
          [Validators.required],
        ],
        type: [this.prerecordedMaterialVO?.type, [Validators.required]],
        fileName: [
          '',
          this.prerecordedMaterialVO?.id ? [] : [Validators.required],
        ],
      },
      { updateOn: 'blur' }
    );
  }

  onSubmit() {
    const vacantSpace: number = this.http.getVacantSpace;
    this.submit = true;
    if (this.materialForm.invalid) return;
    let fileSize = 0;
    if (this.file?.size && vacantSpace && vacantSpace < this.file.size) {
      this.alertService.okErrorAlert('Not enough space.');
      return;
    } else {
      if (this.file?.size) {
        fileSize = this.file?.size;
      }
    }
    let prerecordedMaterialVO = new PrerecordedMaterialVO();
    let file = this.file;
    this.file = undefined;
    prerecordedMaterialVO = this.materialForm.value;
    prerecordedMaterialVO.prerecordedSectionId = this.sectionId;
    this.http.isMaterialUpdatedOrAdded.next(prerecordedMaterialVO);
    this.materialForm.reset();
    this.materialForm.markAsUntouched();
    this.submit = false;
    this.http.sectionMaterialUploadingCount.next(
      new MaterialUploadingCount(this.sectionId, 1)
    );
    this.http.savePrerecordedMaterial(prerecordedMaterialVO, file).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          let total = event.total ? event.total : 0;
          prerecordedMaterialVO.progress =
            Math.round((100 * event.loaded) / total) + ' %';
        } else if (event instanceof HttpResponse) {
          prerecordedMaterialVO.progress = 'uploaded';
          prerecordedMaterialVO.id = event.body.body.id;
          prerecordedMaterialVO.fileName = event.body.body.filePath;
          this.http.sectionMaterialUploadingCount.next(
            new MaterialUploadingCount(this.sectionId, -1)
          );
          this.http.reduceVacantSpace(fileSize);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.http.increaseVacantSpace(fileSize);
        prerecordedMaterialVO.progress = 'failed';
        this.http.sectionMaterialUploadingCount.next(
          new MaterialUploadingCount(this.sectionId, -1)
        );
        this.alertService.errorAlert(error.error.message);
      },
    });
  }

  get getControls() {
    return this.materialForm.controls;
  }

  onFileSelect(event: any) {
    if (this.materialForm.get('type')?.invalid) {
      this.alertService.errorAlert('Please select file type');
      this.fileSelect.nativeElement.value = '';
    }
    this.file = event.target.files[0];
    const type = this.materialForm.get('type')?.value;

    if (type == 'image') {
      if (this.fileCheck.isFileImage(this.file)) {
        if (this.file!.size > 5242880) {
          this.alertService.errorAlert(
            'Image size should not be greater than 5 Mb'
          );
          this.fileSelect.nativeElement.value = '';
          this.file = undefined;
        }
      } else {
        this.file = undefined;
        this.fileSelect.nativeElement.value = '';
        this.alertService.errorAlert('Please select jpg/jpeg/png format');
      }
      return;
    } else if (type == 'video') {
      if (this.fileCheck.isFileVideo(this.file)) {
        if (this.file!.size > 4294967296) {
          this.alertService.errorAlert(
            'Video size should not be greater than 4 GB'
          );
          this.fileSelect.nativeElement.value = '';
          this.file = undefined;
        }
      } else {
        this.file = undefined;
        this.fileSelect.nativeElement.value = '';
        this.alertService.errorAlert('Please select mp4/ogg format');
      }
      return;
    } else if (type == 'audio') {
      if (this.fileCheck.isFileAudio(this.file)) {
        if (this.file!.size > 104857600) {
          this.alertService.errorAlert(
            'Audio size should not be greater than 100 MB'
          );
          this.file = undefined;
          this.fileSelect.nativeElement.value = '';
        }
      } else {
        this.file = undefined;
        this.fileSelect.nativeElement.value = '';
        this.alertService.errorAlert('Please select mpeg format');
      }
      return;
    } else if (type == 'pdf') {
      if (this.fileCheck.isFilePDF(this.file)) {
        if (this.file!.size > 104857600) {
          this.alertService.errorAlert(
            'Pdf size should not be greater than 100 MB'
          );
          this.file = undefined;
          this.fileSelect.nativeElement.value = '';
        }
      } else {
        this.file = undefined;
        this.fileSelect.nativeElement.value = '';
        this.alertService.errorAlert('Please select pdf format');
      }
      return;
    } else {
      this.alertService.errorAlert('Please select valid file type');
      this.file = undefined;
      this.fileSelect.nativeElement.value = '';
    }
  }
}
