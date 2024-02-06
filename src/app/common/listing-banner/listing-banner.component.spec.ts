import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingBannerComponent } from './listing-banner.component';

describe('ListingBannerComponent', () => {
  let component: ListingBannerComponent;
  let fixture: ComponentFixture<ListingBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListingBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
