import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListingComponent } from './admin-listing.component';

describe('AdminListingComponent', () => {
  let component: AdminListingComponent;
  let fixture: ComponentFixture<AdminListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
