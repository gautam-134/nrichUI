import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, map, Observable, of, Subject, Subscription } from 'rxjs';
import { MappingPageComponent } from '../../common/mapping-page/mapping-page.component';
import { LoaderService } from '../../loader.service';
import { MappingType } from '../../model/MappingType';
import {
  FetchClassAndMaterialResult,
  MaterialFetch,
} from '../../model/Material';
import { SwalAlertService } from '../../services/alert/swal-alert.service';
import { AuthService } from '../../services/auth.service';
import { InstituteService } from '../../services/institute/institute.service';
import { MaterialClassMappingComponent } from './material-class-mapping/material-class-mapping.component';

@Component({
  selector: 'app-material-listing',
   
  templateUrl: './material-listing.component.html',
  styleUrl: './material-listing.component.scss'
})
export class MaterialListingComponent implements OnInit, OnDestroy {
  page: number = 0;
  size: number = 10;
  material!: MaterialFetch[];
  searchParam: string = '';
  res!: FetchClassAndMaterialResult;
  subject = new Subject();
  result$!: Observable<any>;
  materialCount!: number;

  typeOfShorting: boolean = true;
  type: any;
  myPlanSubscription$!: Subscription;
  usedSpace: number | undefined;
  totalSpace: number | undefined;
  constructor(
    private loader: LoaderService,
    private instituteService: InstituteService,
    private dialog: MatDialog,
    private router: Router,
    private alertService: SwalAlertService
  ) {}
  ngOnDestroy(): void {
    if (this.myPlanSubscription$) this.myPlanSubscription$.unsubscribe();
  }

  ngOnInit(): void {
    this.refresh(this.page);
    this.applyFilter();
  }

  refresh(page: number) {
    let selectedInstitute = Number.parseInt(
      JSON.parse(localStorage.getItem('auth') || '{}').selectedInstitute
    );
    let idTeacher = JSON.parse(localStorage.getItem('auth') || '{}').user_id;
    this.loader
      .showLoader(
        this.instituteService.fetchMaterial(
          idTeacher,
          selectedInstitute,
          page,
          this.size,
          this.searchParam
        )
      )
      .subscribe((res) => {
        this.material = res.material;
        this.materialCount = res.materialCount;
      });
  }

  editMaterial(materialId: number) {
    this.router.navigate([`/${AuthService.getModulePrefix}/add-material`], {
      queryParams: { id: materialId },
    });
  }

  addMaterial() {
    this.router.navigateByUrl(AuthService.getModulePrefix + '/add-material');
  }

  applyFilter() {
    let selectedInstitute = Number.parseInt(
      JSON.parse(localStorage.getItem('auth') || '{}').selectedInstitute
    );
    let idTeacher = JSON.parse(localStorage.getItem('auth') || '{}').user_id;
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText) =>
          searchText !== ''
            ? this.instituteService.fetchMaterial(
                idTeacher,
                selectedInstitute,
                this.page,
                this.size,
                this.searchParam
              )
            : of([])
        )
      )
      .subscribe((response) => {
        this.result$ = response;
        this.result$.subscribe((value) => {
          this.material = value?.material;
          this.materialCount = value?.materialCount;
        });
      });
  }

  search(evt: any) {
    if (evt.target.value == '') {
      this.refresh(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  editMapping(element: MaterialFetch) {
    this.dialog.open(MaterialClassMappingComponent, {
      width: '100%',
      data: {
        res: this.res,
        materialId: element.idClassMaterial,
        teacherId: element.idTeacher,
        isEdit: true,
      },
    });
  }

  newMapMaterial(element: any) {
    this.dialog.open(MappingPageComponent, {
      data: {
        id: element.idClassMaterial,
        mappingType: MappingType.MATERIAL,
      },
      width: '100%',
      height: '99%',
    });
  }

  mapToClass(element: any) {
    this.dialog.open(MaterialClassMappingComponent, {
      data: {
        id: element.idClassMaterial,
        mappingType: MappingType.MATERIAL,
      },
      width: '100%',
      height: '99%',
    });
  }

  pageChange(event: any) {
    this.refresh(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  short(type: any) {
    this.typeOfShorting = !this.typeOfShorting;
    this.type = type;
  }

  deletematerial(idClassMaterial: number) {
    this.alertService
      .buttonErrorAlert(
        'Are you sure you want to delete this material?',
        'Yes, Delete'
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          this.instituteService.deletematerial(idClassMaterial).subscribe({
            next: (data: any) => {
              this.alertService.successAlert(data?.message);
              this.refresh(this.page);
            },
            error: (error: HttpErrorResponse) => {},
          });
        }
      });
  }
}
