import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrerecordedMaterialListingComponent } from './prerecorded-material-listing.component';

describe('PrerecordedMaterialListingComponent', () => {
  let component: PrerecordedMaterialListingComponent;
  let fixture: ComponentFixture<PrerecordedMaterialListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrerecordedMaterialListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrerecordedMaterialListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
