import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsfeedPostsComponent } from './newsfeed-posts.component';

describe('NewsfeedPostsComponent', () => {
  let component: NewsfeedPostsComponent;
  let fixture: ComponentFixture<NewsfeedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsfeedPostsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsfeedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
