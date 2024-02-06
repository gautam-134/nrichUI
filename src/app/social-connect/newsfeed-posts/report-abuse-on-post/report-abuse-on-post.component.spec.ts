import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAbuseOnPostComponent } from './report-abuse-on-post.component';

describe('ReportAbuseOnPostComponent', () => {
  let component: ReportAbuseOnPostComponent;
  let fixture: ComponentFixture<ReportAbuseOnPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportAbuseOnPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportAbuseOnPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
