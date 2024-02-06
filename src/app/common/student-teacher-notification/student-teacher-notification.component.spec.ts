import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTeacherNotificationComponent } from './student-teacher-notification.component';

describe('StudentTeacherNotificationComponent', () => {
  let component: StudentTeacherNotificationComponent;
  let fixture: ComponentFixture<StudentTeacherNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTeacherNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentTeacherNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
