import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverImageCropComponent } from './cover-image-crop.component';

describe('CoverImageCropComponent', () => {
  let component: CoverImageCropComponent;
  let fixture: ComponentFixture<CoverImageCropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverImageCropComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoverImageCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
