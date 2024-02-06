import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentTeacherNotificationComponent } from './create-student-teacher-notification.component';

describe('CreateStudentTeacherNotificationComponent', () => {
  let component: CreateStudentTeacherNotificationComponent;
  let fixture: ComponentFixture<CreateStudentTeacherNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStudentTeacherNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateStudentTeacherNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
