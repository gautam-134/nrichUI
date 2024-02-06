import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledCoursesComponent } from './disabled-courses.component';

describe('DisabledCoursesComponent', () => {
  let component: DisabledCoursesComponent;
  let fixture: ComponentFixture<DisabledCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisabledCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisabledCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
