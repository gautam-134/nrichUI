import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BatchVO } from 'src/app/model/BatchVO';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';
import { BatchService } from 'src/app/services/batch.service';
import { CourseWizardService } from 'src/app/services/course/course-wizard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-batches',
  standalone: true,
  imports: [],
  templateUrl: './course-batches.component.html',
  styleUrl: './course-batches.component.scss'
})
export class CourseBatchesComponent implements OnInit {
  batches: BatchVO[] = [];
  constructor(
    private courseWizard: CourseWizardService,
    private batchService: BatchService,
    private alertService: SwalAlertService
  ) {}

  ngOnInit(): void {
    this.batches = this.courseWizard.getBatches;
  }

  addBatch() {
    this.courseWizard.batchSubject$.next(false);
  }

  edit(batch: BatchVO) {
    this.courseWizard.batchSubject$.next(batch);
  }

  showWarning() {
    return Swal.fire({
      title:
        '<p style="font-weight: 500;font-size: 24px;color: #4A4A4A;margin-bottom: -8px;margin-top: -30px;margin-left: 15%;margin-right: 15%;">' +
        'Do you want delete this batch?</p>',
      html: 'All mappings will be deleted',
      imageUrl: 'assets/alerts/error.gif',
      imageWidth: 140,
      imageHeight: 140,
      imageAlt: 'Delete',
      confirmButtonColor: '#FF635F',
      confirmButtonText: 'Delete',
      showCancelButton: true,
      cancelButtonColor: 'lightgrey',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
  }

  async delete(id: number, index: number) {
    await this.showWarning().then((value: boolean) => {
      if (value) {
        this.batchService.disableBatch(id).subscribe({
          next: (data: any) => {
            this.courseWizard.deleteBatch(index);
          },
          error: (error: HttpErrorResponse) => {
            this.alertService.errorAlert('Something went wrong!');
          },
        });
      }
    });
  }
}
