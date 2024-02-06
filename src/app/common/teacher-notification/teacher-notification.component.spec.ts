import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherNotificationComponent } from './teacher-notification.component';

describe('TeacherNotificationComponent', () => {
  let component: TeacherNotificationComponent;
  let fixture: ComponentFixture<TeacherNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
