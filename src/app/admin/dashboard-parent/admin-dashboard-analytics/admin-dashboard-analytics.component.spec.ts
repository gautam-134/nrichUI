import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardAnalyticsComponent } from './admin-dashboard-analytics.component';

describe('AdminDashboardAnalyticsComponent', () => {
  let component: AdminDashboardAnalyticsComponent;
  let fixture: ComponentFixture<AdminDashboardAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDashboardAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
