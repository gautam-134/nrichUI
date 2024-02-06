import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutesPlanComponent } from './institutes-plan.component';

describe('InstitutesPlanComponent', () => {
  let component: InstitutesPlanComponent;
  let fixture: ComponentFixture<InstitutesPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutesPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstitutesPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
