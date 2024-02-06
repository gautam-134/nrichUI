import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommenPlayStoreCardComponent } from './commen-play-store-card.component';

describe('CommenPlayStoreCardComponent', () => {
  let component: CommenPlayStoreCardComponent;
  let fixture: ComponentFixture<CommenPlayStoreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommenPlayStoreCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommenPlayStoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
