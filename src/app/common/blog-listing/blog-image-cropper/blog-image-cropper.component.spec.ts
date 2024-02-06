import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogImageCropperComponent } from './blog-image-cropper.component';

describe('BlogImageCropperComponent', () => {
  let component: BlogImageCropperComponent;
  let fixture: ComponentFixture<BlogImageCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogImageCropperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
