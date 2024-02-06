import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkLeadsUploadComponent } from './bulk-leads-upload.component';

describe('BulkLeadsUploadComponent', () => {
  let component: BulkLeadsUploadComponent;
  let fixture: ComponentFixture<BulkLeadsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkLeadsUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulkLeadsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
