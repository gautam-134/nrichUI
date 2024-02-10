import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../loader.service';
import { CrmFormFieldsVO } from '../../model/CrmFormFieldsVO';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { CRMService } from '../../services/CRM/crm.service';

@Component({
  selector: 'app-add-field',
   
  templateUrl: './add-field.component.html',
  styleUrl: './add-field.component.scss'
})
export class AddFieldComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;
  additionalFields: CrmFormFieldsVO[] = [];
  isUpdate: boolean = false;

  constructor(
    private crmService: CRMService,
    private loader: LoaderService,
    private alertService: SwalAlertService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.createForm();
  }

  refresh() {
    this.loader.showLoader(this.crmService.getFormFields()).subscribe({
      next: (data: CrmFormFieldsVO[]) => {
        this.additionalFields = data;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Error while fetching additional fields');
      },
    });
  }

  createForm() {
    this.form = this.fb.group(
      {
        id: [''],
        fieldName: ['', Validators.required],
        required: [false],
      },
      { updateOn: 'blur' }
    );
  }

  addField() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loader
      .showLoader(
        this.crmService.addField(
          this.form.get('id')?.value,
          this.form.get('fieldName')?.value,
          this.form.get('required')?.value
        )
      )
      .subscribe({
        next: (data: CrmFormFieldsVO) => {
          this.submitted = false;
          this.alertService.successAlert(
            `Field ${this.isUpdate ? 'updated' : 'added'} successfully`
          );
          if (this.isUpdate) {
            const index = this.additionalFields.findIndex(
              (field) => field.id == this.form.get('id')?.value
            );
            this.additionalFields.splice(index, 1);
          }
          this.additionalFields.push(data);
          this.form.patchValue({
            id: '',
            fieldName: '',
            required: false,
          });
          this.isUpdate = false;
        },
        error: (error: HttpErrorResponse) => {
          this.isUpdate = false;
          if (error.error.status == 507) {
            this.alertService.okErrorAlert(error.error.message);
          } else {
            this.alertService.errorAlert(
              `Error while ${
                this.isUpdate ? 'updating' : 'adding'
              } additional field`
            );
          }
        },
      });
  }

  editField(element: CrmFormFieldsVO) {
    this.isUpdate = true;
    this.form.patchValue({
      id: element.id,
      fieldName: element.fieldName,
      required: element.required,
    });
  }

  deleteField(element: CrmFormFieldsVO) {
    this.alertService
      .buttonSuccessAlert(
        'Are you sure you want to delete this field?',
        'Yes, delete it'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.loader
            .showLoader(this.crmService.deleteField(element.id))
            .subscribe({
              next: (data) => {
                const index = this.additionalFields.findIndex(
                  (field) => field.id == element.id
                );
                this.additionalFields.splice(index, 1);
              },
              error: (error: HttpErrorResponse) => {
                this.alertService.errorAlert('Error while deleting field');
              },
            });
        }
      });
  }

  get controls() {
    return this.form.controls;
  }
}
