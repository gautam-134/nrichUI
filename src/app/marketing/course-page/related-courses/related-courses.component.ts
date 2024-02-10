import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MobileCourseVO } from '../../model/MobileCourseVO';

@Component({
  selector: 'app-related-courses',
   
  templateUrl: './related-courses.component.html',
  styleUrl: './related-courses.component.scss'
})
export class RelatedCoursesComponent implements OnInit {
  @Input("relatedCourses") relatedCourses: MobileCourseVO[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {}
  viewRelatedCourses(){
    this.router.navigate(['/course-list'], {
      queryParams: { search: 'allCourses' },
    });
  }
}
