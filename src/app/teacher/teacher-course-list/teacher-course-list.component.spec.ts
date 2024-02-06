import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCourseListComponent } from './teacher-course-list.component';

describe('TeacherCourseListComponent', () => {
  let component: TeacherCourseListComponent;
  let fixture: ComponentFixture<TeacherCourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCourseListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
