import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForOtherCategoryComponent } from './request-for-other-category.component';

describe('RequestForOtherCategoryComponent', () => {
  let component: RequestForOtherCategoryComponent;
  let fixture: ComponentFixture<RequestForOtherCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestForOtherCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestForOtherCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
