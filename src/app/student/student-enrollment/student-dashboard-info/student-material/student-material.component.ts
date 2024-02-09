import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, map, Observable, of, Subject } from 'rxjs';
import { PreviewComponent } from 'src/app/common/file-management/preview/preview.component';
import { LoaderService } from 'src/app/loader.service';
import { classMaterialVO } from 'src/app/model/ClassMaterialVO';
import { StudentService } from 'src/app/services/student/student.service';

import { MaterialPreviewComponent } from './material-preview/material-preview.component';


@Component({
  selector: 'app-student-material',
  standalone: true,
  imports: [],
  templateUrl: './student-material.component.html',
  styleUrl: './student-material.component.scss'
})
export class StudentMaterialComponent implements OnInit {
 
  material!: classMaterialVO[];
  batchId!: number;
  filePath: string = '';
  page: number = 0;
  size: number = 5;
  searchParam:string='';
  videoTypes: string[] = ['mp4', 'mov', 'avi', 'mkv'];
  imageTypes: string[] = ['jpeg', 'jpg', 'png'];
  audioTypes: string[] = ['mp3'];
  otherTypes: string[] = ['pdf', 'doc', 'docx'];
  totalCount!: number;
  subject = new Subject<string>();

  result$!: Observable<any>;
 
      typeOfShorting:boolean=true;
    type: any;
  constructor(private dialog: MatDialog,private studentService:StudentService,  private route: ActivatedRoute,private loader:LoaderService ) {}


  ngOnInit(): void {
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
     this.fetchMaterial(this.page);
     this.applyFilter();
  }

fetchMaterial(page:number){
  this.studentService.fetchBatchMaterial(this.batchId,page,this.size,this.searchParam).subscribe((res:any)=>{
    this.material= res?.body.ClassMaterialVOList;
    this.totalCount=res?.body.total_count;
  })
}
  viewDetail(element: any) {
    this.dialog.open(MaterialPreviewComponent, {
      data: { element: element },
      width: '600px',
      height: '400px',
    });
  }



  showPreview(key: string) {
    const filePath = this.filePath + key;
    const type = this.getFileType(filePath);
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
      :this.audioTypes.includes(
        filePath.substring(filePath.lastIndexOf('.') +1)
      )
      ?'audio'
      : 'file';
  }

  pageChange(event: any) {
    this.fetchMaterial(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.fetchMaterial(0);
  }
  searchFile(evt: any) {
    if (evt.target.value == '') {
      this.fetchMaterial(this.page);
    } else {
      const searchText = evt.target.value;
      this.subject.next(searchText);
    }
  }

  applyFilter() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText: string) =>
          searchText !== ''
            ? this.loader.showLoader(
              this.studentService.fetchBatchMaterial(this.batchId,this.page,this.size,this.searchParam)
              )
            : of([])
        )
      )
      .subscribe((res: any) => {
        this.result$ = res;
        this.result$.subscribe((value: any) => {
          this.material= value?.body.ClassMaterialVOList;
          this.totalCount=value?.body.total_count;
        });
      });
  }
  short(type:any){
    this.typeOfShorting=!this.typeOfShorting
    this.type = type;
  
  }
}

