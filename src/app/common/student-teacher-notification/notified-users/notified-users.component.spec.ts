import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifiedUsersComponent } from './notified-users.component';

describe('NotifiedUsersComponent', () => {
  let component: NotifiedUsersComponent;
  let fixture: ComponentFixture<NotifiedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifiedUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotifiedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
