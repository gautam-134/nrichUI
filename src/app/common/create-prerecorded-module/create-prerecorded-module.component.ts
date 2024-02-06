import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { MappingType } from 'src/app/model/MappingType';
import {
  PrerecordedModuleVO,
  PrerecordedSectionVO,
} from 'src/app/model/PrerecordedModels';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { InstituteService } from 'src/app/services/institute/institute.service';
import { PreRecordedModuleService } from 'src/app/services/pre-recorded-module.service';
import { MappingPageComponent } from '../mapping-page/mapping-page.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-prerecorded-module',
  standalone: true,
  imports: [],
  templateUrl: './create-prerecorded-module.component.html',
  styleUrl: './create-prerecorded-module.component.scss'
})
export class CreatePrerecordedModuleComponent implements OnInit {
  moduleForm!: FormGroup;
  prerecorded = new PrerecordedModuleVO();
  submit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private httpService: PreRecordedModuleService,
    private alertService: SwalAlertService,
    private loader: LoaderService,
    private activatedRoute: ActivatedRoute,
    private instituteService: InstituteService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.prerecorded.overAllMaterialUploadingCount = 0;
    const id = this.activatedRoute.snapshot.queryParams['id'];
    this.prerecorded.instituteId = +AuthService.getInstituteId;
    this.createForm();
    this.fetchVacentSpace();
    if (id) this.getModule(id);
  }

  getModule(moduleId: number) {
    this.httpService.fetchPreRecordedModule(moduleId).subscribe({
      next: (data: ApiResponse) => {
        this.prerecorded = data.body;
        this.createForm();
      },
      error: (error: HttpErrorResponse) => {
      },
    });
  }

  createForm() {
    this.moduleForm = this.fb.group(
      {
        id: [this.prerecorded.id],
        moduleName: [this.prerecorded.moduleName, [Validators.required]],
      },
      { updateOn: 'submit' }
    );
  }

  submitModule() {
    this.submit = true;
    if (this.moduleForm.invalid) return;
    this.prerecorded.id = this.moduleForm.get('id')?.value;
    this.prerecorded.moduleName = this.moduleForm.get('moduleName')?.value;
    this.loader
      .showLoader(this.httpService.savePreRecordedModule(this.prerecorded))
      .subscribe({
        next: (data: ApiResponse) => {
          if (this.activatedRoute.snapshot.queryParams['id'] == undefined && this.prerecorded.id == null) {
            this.prerecorded.prerecordedSectionVOs.push(
              new PrerecordedSectionVO()
            );
          }
          this.prerecorded.id = data.body;
          this.moduleForm.patchValue({
            id: this.prerecorded.id
          })
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.okErrorAlert(error.error.message);
        },
      });
  }

  fetchVacentSpace() {
    this.instituteService.fetchVacentSpace().subscribe({
      next: (data: ApiResponse) => {
        this.httpService.setVacantSpace(data.body);
      },
    });
  }

  get getControls() {
    return this.moduleForm.controls;
  }

  addSection() {
    this.prerecorded.prerecordedSectionVOs.push(new PrerecordedSectionVO());
  }

  updateModuleStatus(id: number) {
    this.loader.showLoader(this.httpService.UpdateModuleStatus(id)).subscribe({
      next: (data: ApiResponse) => {
        // this.alertService.successAlert(
        //   data.message ? data.message : 'No Message available.'
        // );
        this.alertService
            .buttonSuccessAlert(data.message ? data.message : 'No Message available.'
            , 'Map To Batch')
            .then((result) => {
              if (result.isConfirmed) {
                this.dialog.open(MappingPageComponent, {
                  data: {
                    id: id,
                    mappingType: MappingType.PRERECORDED,
                  },
                  width: '100%',
                  height: '99%',
                });
              }
            });
        this.router.navigateByUrl(`${AuthService.getModulePrefix}/prerecorded-modules`);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.okErrorAlert(error.error.message);
      },
    });
  }
}
