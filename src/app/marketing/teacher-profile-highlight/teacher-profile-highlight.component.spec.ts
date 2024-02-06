import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherProfileHighlightComponent } from './teacher-profile-highlight.component';

describe('TeacherProfileHighlightComponent', () => {
  let component: TeacherProfileHighlightComponent;
  let fixture: ComponentFixture<TeacherProfileHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherProfileHighlightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherProfileHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
