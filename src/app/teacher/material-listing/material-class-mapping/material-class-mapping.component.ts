import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../../../loader.service';
import {
  ClassMappingVO,
  CourseBatchMapVO,
} from '../../../model/CourseBatchMapVO';
import { SwalAlertService } from '../../../services/alert/swal-alert.service';
import { ClassService } from '../../../services/Classes/class.service';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-material-class-mapping',
   
  templateUrl: './material-class-mapping.component.html',
  styleUrl: './material-class-mapping.component.scss'
})
export class MaterialClassMappingComponent implements OnInit {
  classMapping: ClassMappingVO[] = [];
  selectedClasses: ClassMappingVO[] = [];
  mapping: string = '';
  teacher: CourseBatchMapVO[] = [];
  uploadSuccess = new EventEmitter<boolean>();
  flag: boolean = false;
  selectedBatch: CourseBatchMapVO[] = [];
  filterDate!: Date;
  typeOfShorting: boolean = true;
  isRecordFetched: boolean = false;
  type: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number; mappingType: string },
    private commonService: CommonService,
    private loader: LoaderService,
    private _snackBar: MatSnackBar,
    private alertService: SwalAlertService,
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    this.mapping = this.data.mappingType;
    this.classMapping = [];

      this.classService.fetchMappedMaterialClasses(
        this.data.id
      )
    .subscribe({
      next: (data: ClassMappingVO[]) => {
        this.classMapping = data;
      },
    });
  }


  fetchMaterialClassesByDate(event: any) {
    this.filterDate = event.target.value;
    this.loader
      .showLoader(
        this.classService.fetchMaterialClassesByDate(
          this.filterDate,
          this.data.id
        )
      )
      .subscribe({
        next: (data: ClassMappingVO[]) => {
          this.isRecordFetched = true;
          this.classMapping = data;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching class list');
        },
      });
  }

  fetchMaterialClassesByDateSearch(event: any) {
        this.classService.fetchMaterialClassesByDateSearch(
          this.filterDate,
          event.target.value,
          this.data.id
        )
      
      .subscribe({
        next: (data: ClassMappingVO[]) => {
          this.isRecordFetched = true;
          this.classMapping = data;
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.errorAlert('Error while fetching class list');
        },
      });
  }

  addToSelectedClasses() {
    this.classMapping.map((cl) => {
      if (cl.selected) {
        this.selectedClasses.push(cl);
      }
    });
  }

  saveClassMapping(event: any, classMapping: ClassMappingVO) {
    classMapping.selected = event.target.checked;
    classMapping.materialId = this.data.id;
    const index = this.classMapping.findIndex((cl) => cl.idClassSchedule == classMapping.idClassSchedule);
    this.classMapping[index].selected = event.target.checked;
    if (event.target.checked) {
      this.selectedClasses.push(classMapping);
    } else {
      const index1 = this.selectedClasses.findIndex(
        (cl) => cl.idClassSchedule == classMapping.idClassSchedule
      );
      this.selectedClasses.splice(index1, 1);
    }
    this.loader.showLoader(
    this.commonService.saveClassMapping([classMapping])).subscribe({
      next: (data: any) => {
        this.openSnackBar(event.target.checked);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.errorAlert('Error while mapping');
      },
    });
  }

  openSnackBar(event: boolean) {
    event ? this._snackBar.open('Mapping created successfully!', '', {
      duration: 2000,
    }) : this._snackBar.open('Mapping removed successfully!', '', {
      duration: 2000,
    });
  }
  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }
}
