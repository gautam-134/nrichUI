import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../loader.service';
import { ApiResponse } from '../../../model/ApiResponse';
import {
  MaterialUploadingCount,
  PrerecordedMaterialVO,
  PrerecordedModuleVO,
  PrerecordedSectionVO,
} from '../../../model/PrerecordedModels';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { PreRecordedModuleService } from '../../../services/pre-recorded-module.service';

@Component({
  selector: 'app-create-prerecorded-sections',
   
  templateUrl: './create-prerecorded-sections.component.html',
  styleUrl: './create-prerecorded-sections.component.scss'
})
export class CreatePrerecordedSectionsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() module!: PrerecordedModuleVO;
  @Input() prrecordedSection!: PrerecordedSectionVO;
  sectionForm!: FormGroup;
  isSubmit: boolean = false;
  materialUploadingSubscription!: Subscription;
  constructor(
    private fb: FormBuilder,
    private http: PreRecordedModuleService,
    private alertService: SwalAlertService,
    private loader: LoaderService
  ) {}
  ngAfterViewInit(): void {
    this.prrecordedSection.prerecordedMaterialVOs.forEach(
      (value: PrerecordedMaterialVO) => {
        value.progress = 'uploaded';
        this.http.isMaterialUpdatedOrAdded.next(value);
      }
    );
  }
  ngOnDestroy(): void {
    if (this.materialUploadingSubscription)
      this.materialUploadingSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.prrecordedSection.materialUploadingCount = 0;
    this.subscribeToMaterialUploadedCount();
    this.sectionForm = this.fb.group(
      {
        sectionName: [this.prrecordedSection?.sectionName, Validators.required],
        displayOrder: [
          this.prrecordedSection?.displayOrder,
          Validators.required,
        ],
      },
      { updateOn: 'submit' }
    );
  }

  subscribeToMaterialUploadedCount() {
    this.materialUploadingSubscription =
      this.http.sectionMaterialUploadingCount.subscribe(
        (data: MaterialUploadingCount | undefined) => {
          if (data) {
            this.module.overAllMaterialUploadingCount =
              this.module.overAllMaterialUploadingCount + data.count;
            if (data.sectionId == this.prrecordedSection.id) {
              this.prrecordedSection.materialUploadingCount =
                this.prrecordedSection.materialUploadingCount + data.count;
            }
          }
        }
      );
  }

  savePrerecordedSection() {
    this.isSubmit = true;
    if (this.sectionForm.invalid) return;
    this.prrecordedSection.sectionName =
      this.sectionForm.get('sectionName')?.value;
    this.prrecordedSection.displayOrder =
      this.sectionForm.get('displayOrder')?.value;
    this.prrecordedSection.prerecordedModuleId = this.module.id;
    this.loader
      .showLoader(this.http.savePrerecordedSections(this.prrecordedSection))
      .subscribe({
        next: (data: ApiResponse) => {
          if (this.prrecordedSection.id) {
            this.alertService.successAlert('Section updated successfully');
          }
          this.prrecordedSection.id = data.body;
        },
        error: (error: HttpErrorResponse) => {
        },
      });
  }

  deleteSection() {
    this.alertService
      .buttonErrorAlert(
        'Are you sure you want to delete this section',
        'Yes, Delete'
      )
      .then((result) => {
        if (result.isConfirmed) {
          if (this.prrecordedSection.id) {
            this.loader
              .showLoader(this.http.deleteSection(this.prrecordedSection.id))
              .subscribe({
                next: (response: any) => {
                  this.alertService.successAlert(response.message);
                  this.module.prerecordedSectionVOs.splice(
                    this.module.prerecordedSectionVOs.findIndex(
                      (section) => section.id == this.prrecordedSection.id
                    ),
                    1
                  );
                },
                error: (error: HttpErrorResponse) => {
                  this.alertService.errorAlert('Error while deleting section');
                },
              });
          } else {
            this.alertService.successAlert('Section deleted successfully');
            this.module.prerecordedSectionVOs.splice(
              this.module.prerecordedSectionVOs.findIndex(
                (section) => section.id == this.prrecordedSection.id
              ),
              1
            );
          }
        }
      });
  }

  get getControls() {
    return this.sectionForm.controls;
  }
}