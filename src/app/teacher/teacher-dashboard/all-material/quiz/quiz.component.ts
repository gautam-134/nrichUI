import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {
  page: number = 0;
  size: number = 5;
  totalCount: number = 0;
  ELEMENT_DATA: any[] = [];
  typeOfShorting:boolean=true;
  type: any;
  constructor(
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refresh(this.page);
  }

  refresh(page: number) {
    this.teacherService
      .fetchAllQuizes(
        +this.route.snapshot.queryParams?.['idbatch'],
        page,
        this.size
      )
      .subscribe(
        (res: any) => {
          this.ELEMENT_DATA = res.quizes.reverse();
          this.totalCount = res.totalCount;
        },
        (error: any) => {}
      );
  }

  quizSubmitBy(id: number) {
    this.router.navigate([`${AuthService.getModulePrefix}/quiz-submit-by`], {
      queryParams: { id: id },
    });
  }

  pageChange(event: any) {
    this.refresh(event);
  }
  changeSize(event: any) {
    this.size = event;
    this.refresh(0);
  }

  short(type:any){
    this.typeOfShorting=!this.typeOfShorting
    this.type = type;
  
  }
      
}