import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllClassComponent } from './all-class.component';

describe('AllClassComponent', () => {
  let component: AllClassComponent;
  let fixture: ComponentFixture<AllClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllClassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
