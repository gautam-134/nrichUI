import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrerecordedpreviewComponent } from './prerecordedpreview.component';

describe('PrerecordedpreviewComponent', () => {
  let component: PrerecordedpreviewComponent;
  let fixture: ComponentFixture<PrerecordedpreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrerecordedpreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrerecordedpreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
