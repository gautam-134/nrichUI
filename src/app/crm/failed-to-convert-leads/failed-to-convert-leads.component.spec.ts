import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedToConvertLeadsComponent } from './failed-to-convert-leads.component';

describe('FailedToConvertLeadsComponent', () => {
  let component: FailedToConvertLeadsComponent;
  let fixture: ComponentFixture<FailedToConvertLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailedToConvertLeadsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FailedToConvertLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
