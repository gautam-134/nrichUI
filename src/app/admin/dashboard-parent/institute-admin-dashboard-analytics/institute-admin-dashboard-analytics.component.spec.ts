import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteAdminDashboardAnalyticsComponent } from './institute-admin-dashboard-analytics.component';

describe('InstituteAdminDashboardAnalyticsComponent', () => {
  let component: InstituteAdminDashboardAnalyticsComponent;
  let fixture: ComponentFixture<InstituteAdminDashboardAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteAdminDashboardAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstituteAdminDashboardAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
