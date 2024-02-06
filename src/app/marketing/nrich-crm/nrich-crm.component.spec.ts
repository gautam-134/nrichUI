import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NrichCrmComponent } from './nrich-crm.component';

describe('NrichCrmComponent', () => {
  let component: NrichCrmComponent;
  let fixture: ComponentFixture<NrichCrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NrichCrmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NrichCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
