import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeActionOnReportedPostComponent } from './take-action-on-reported-post.component';

describe('TakeActionOnReportedPostComponent', () => {
  let component: TakeActionOnReportedPostComponent;
  let fixture: ComponentFixture<TakeActionOnReportedPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeActionOnReportedPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TakeActionOnReportedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
