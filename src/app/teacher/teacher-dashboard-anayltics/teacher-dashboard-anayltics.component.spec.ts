import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDashboardAnaylticsComponent } from './teacher-dashboard-anayltics.component';

describe('TeacherDashboardAnaylticsComponent', () => {
  let component: TeacherDashboardAnaylticsComponent;
  let fixture: ComponentFixture<TeacherDashboardAnaylticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherDashboardAnaylticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherDashboardAnaylticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
