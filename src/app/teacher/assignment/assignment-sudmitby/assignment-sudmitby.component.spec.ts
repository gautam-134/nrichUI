import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSudmitbyComponent } from './assignment-sudmitby.component';

describe('AssignmentSudmitbyComponent', () => {
  let component: AssignmentSudmitbyComponent;
  let fixture: ComponentFixture<AssignmentSudmitbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentSudmitbyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignmentSudmitbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
