import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurrentPlanComponent } from './edit-current-plan.component';

describe('EditCurrentPlanComponent', () => {
  let component: EditCurrentPlanComponent;
  let fixture: ComponentFixture<EditCurrentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCurrentPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCurrentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
