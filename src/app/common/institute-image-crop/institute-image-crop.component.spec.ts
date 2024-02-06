import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteImageCropComponent } from './institute-image-crop.component';

describe('InstituteImageCropComponent', () => {
  let component: InstituteImageCropComponent;
  let fixture: ComponentFixture<InstituteImageCropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituteImageCropComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstituteImageCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
