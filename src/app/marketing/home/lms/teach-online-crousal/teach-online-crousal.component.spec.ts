import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachOnlineCrousalComponent } from './teach-online-crousal.component';

describe('TeachOnlineCrousalComponent', () => {
  let component: TeachOnlineCrousalComponent;
  let fixture: ComponentFixture<TeachOnlineCrousalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachOnlineCrousalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeachOnlineCrousalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
