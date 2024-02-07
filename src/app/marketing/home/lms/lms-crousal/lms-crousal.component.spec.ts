import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsCrousalComponent } from './lms-crousal.component';

describe('LmsCrousalComponent', () => {
  let component: LmsCrousalComponent;
  let fixture: ComponentFixture<LmsCrousalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LmsCrousalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LmsCrousalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
