import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteAchieversListingComponent } from './institute-achievers-listing.component';

describe('InstituteAchieversListingComponent', () => {
  let component: InstituteAchieversListingComponent;
  let fixture: ComponentFixture<InstituteAchieversListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteAchieversListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstituteAchieversListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
