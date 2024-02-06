import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PrerecordedMaterialVO } from 'src/app/model/PrerecordedModels';
import { PreRecordedModuleService } from 'src/app/services/pre-recorded-module.service';
import { PreviewComponent } from '../../file-management/preview/preview.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/loader.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from 'src/app/services/alert/swal-alert.service';

@Component({
  selector: 'app-prerecorded-material-listing',
  standalone: true,
  imports: [],
  templateUrl: './prerecorded-material-listing.component.html',
  styleUrl: './prerecorded-material-listing.component.scss'
})
export class PrerecordedMaterialListingComponent implements OnInit, OnDestroy {
  prerecordedMaterialVO: PrerecordedMaterialVO[] = [];
  subscription!: Subscription;
  @Input('id') sectionId!: number;
  preUpdatedMaterialIndex!: number;
  constructor(
    private http: PreRecordedModuleService,
    private dialog: MatDialog,
    private loader: LoaderService,
    private alertService: SwalAlertService
  ) {}
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.http.isMaterialUpdatedOrAdded.subscribe(
      (data: PrerecordedMaterialVO | undefined) => {
        if (data) {
          if (data.prerecordedSectionId == this.sectionId) {
            const index = data.id
              ? this.prerecordedMaterialVO.findIndex(
                  (value) => value.id == data.id
                )
              : -1;
            if (index != -1) this.prerecordedMaterialVO[index] = data;
            else this.prerecordedMaterialVO.push(data);
          }
        }
      }
    );
  }

  edit(element: PrerecordedMaterialVO, i: number) {
    if (this.preUpdatedMaterialIndex)
      this.prerecordedMaterialVO[this.preUpdatedMaterialIndex].progress =
        'uploaded';
    this.preUpdatedMaterialIndex = i;
    element.progress = 'updating';
    this.http.isMaterialUpdatedOrAdded.next(element);
  }

  removeMaterial(element: PrerecordedMaterialVO) {
    this.alertService
      .buttonErrorAlert(
        'Are you sure you want to remove this material',
        'Yes, Delete'
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.loader
            .showLoader(this.http.deletePrerecordedMaterial(element.id))
            .subscribe({
              next: (response: any) => {
                const index = this.prerecordedMaterialVO.findIndex(
                  (material) => material.id == element.id
                );
                if (index != -1) {
                  this.prerecordedMaterialVO.splice(index, 1);
                }
              },
              error: (error: HttpErrorResponse) => {
                this.alertService.errorAlert('Error while removing material');
              },
            });
        }
      });
  }

  showPreview(path: string, type: string) {
    this.dialog.open(PreviewComponent, {
      maxWidth: '800px',
      data: {
        path: path,
        type: type,
      },
      maxHeight: '100%',
    });
  }
}
