import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteManagementComponent } from './institute-management.component';

describe('InstituteManagementComponent', () => {
  let component: InstituteManagementComponent;
  let fixture: ComponentFixture<InstituteManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstituteManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
