import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonFeaturesPreviewComponent } from './addon-features-preview.component';

describe('AddonFeaturesPreviewComponent', () => {
  let component: AddonFeaturesPreviewComponent;
  let fixture: ComponentFixture<AddonFeaturesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddonFeaturesPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddonFeaturesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
