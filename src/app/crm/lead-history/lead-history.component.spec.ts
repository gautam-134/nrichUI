import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadHistoryComponent } from './lead-history.component';

describe('LeadHistoryComponent', () => {
  let component: LeadHistoryComponent;
  let fixture: ComponentFixture<LeadHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeadHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
