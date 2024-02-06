import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialListingComponent } from './material-listing.component';

describe('MaterialListingComponent', () => {
  let component: MaterialListingComponent;
  let fixture: ComponentFixture<MaterialListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
