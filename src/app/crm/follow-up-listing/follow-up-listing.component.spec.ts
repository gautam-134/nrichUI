import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpListingComponent } from './follow-up-listing.component';

describe('FollowUpListingComponent', () => {
  let component: FollowUpListingComponent;
  let fixture: ComponentFixture<FollowUpListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FollowUpListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
