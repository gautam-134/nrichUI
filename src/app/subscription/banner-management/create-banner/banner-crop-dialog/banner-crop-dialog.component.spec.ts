import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerCropDialogComponent } from './banner-crop-dialog.component';

describe('BannerCropDialogComponent', () => {
  let component: BannerCropDialogComponent;
  let fixture: ComponentFixture<BannerCropDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerCropDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BannerCropDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
