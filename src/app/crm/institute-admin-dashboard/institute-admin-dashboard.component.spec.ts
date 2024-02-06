import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteAdminDashboardComponent } from './institute-admin-dashboard.component';

describe('InstituteAdminDashboardComponent', () => {
  let component: InstituteAdminDashboardComponent;
  let fixture: ComponentFixture<InstituteAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteAdminDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstituteAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
