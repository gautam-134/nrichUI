import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoryRequestManagementComponent } from './new-category-request-management.component';

describe('NewCategoryRequestManagementComponent', () => {
  let component: NewCategoryRequestManagementComponent;
  let fixture: ComponentFixture<NewCategoryRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCategoryRequestManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCategoryRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
