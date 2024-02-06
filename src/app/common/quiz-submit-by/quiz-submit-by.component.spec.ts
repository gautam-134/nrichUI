import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSubmitByComponent } from './quiz-submit-by.component';

describe('QuizSubmitByComponent', () => {
  let component: QuizSubmitByComponent;
  let fixture: ComponentFixture<QuizSubmitByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizSubmitByComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizSubmitByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
