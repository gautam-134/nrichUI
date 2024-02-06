import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCropperComponent } from './quiz-cropper.component';

describe('QuizCropperComponent', () => {
  let component: QuizCropperComponent;
  let fixture: ComponentFixture<QuizCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizCropperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
