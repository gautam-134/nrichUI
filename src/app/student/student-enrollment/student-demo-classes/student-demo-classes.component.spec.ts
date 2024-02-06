import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDemoClassesComponent } from './student-demo-classes.component';

describe('StudentDemoClassesComponent', () => {
  let component: StudentDemoClassesComponent;
  let fixture: ComponentFixture<StudentDemoClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDemoClassesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentDemoClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
