import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaystoreMobileComponent } from './playstore-mobile.component';

describe('PlaystoreMobileComponent', () => {
  let component: PlaystoreMobileComponent;
  let fixture: ComponentFixture<PlaystoreMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaystoreMobileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaystoreMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
