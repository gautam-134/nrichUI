import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialVideoPlayerComponent } from './material-video-player.component';

describe('MaterialVideoPlayerComponent', () => {
  let component: MaterialVideoPlayerComponent;
  let fixture: ComponentFixture<MaterialVideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialVideoPlayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
