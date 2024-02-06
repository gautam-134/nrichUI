import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbuseReportListingComponent } from './abuse-report-listing.component';

describe('AbuseReportListingComponent', () => {
  let component: AbuseReportListingComponent;
  let fixture: ComponentFixture<AbuseReportListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbuseReportListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbuseReportListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
