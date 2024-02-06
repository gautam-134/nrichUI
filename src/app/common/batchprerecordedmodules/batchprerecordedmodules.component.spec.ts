import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchprerecordedmodulesComponent } from './batchprerecordedmodules.component';

describe('BatchprerecordedmodulesComponent', () => {
  let component: BatchprerecordedmodulesComponent;
  let fixture: ComponentFixture<BatchprerecordedmodulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchprerecordedmodulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BatchprerecordedmodulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
