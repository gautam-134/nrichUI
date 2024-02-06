import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAchieverComponent } from './add-achiever.component';

describe('AddAchieverComponent', () => {
  let component: AddAchieverComponent;
  let fixture: ComponentFixture<AddAchieverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAchieverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAchieverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
