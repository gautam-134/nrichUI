import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalLibrarySearchComponent } from './digital-library-search.component';

describe('DigitalLibrarySearchComponent', () => {
  let component: DigitalLibrarySearchComponent;
  let fixture: ComponentFixture<DigitalLibrarySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalLibrarySearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DigitalLibrarySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
