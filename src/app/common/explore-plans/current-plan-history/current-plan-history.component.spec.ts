import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPlanHistoryComponent } from './current-plan-history.component';

describe('CurrentPlanHistoryComponent', () => {
  let component: CurrentPlanHistoryComponent;
  let fixture: ComponentFixture<CurrentPlanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentPlanHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentPlanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
