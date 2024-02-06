import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbuseReportedByComponent } from './abuse-reported-by.component';

describe('AbuseReportedByComponent', () => {
  let component: AbuseReportedByComponent;
  let fixture: ComponentFixture<AbuseReportedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbuseReportedByComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbuseReportedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
