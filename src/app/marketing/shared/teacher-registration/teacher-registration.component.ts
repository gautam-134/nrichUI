import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-teacher-registration',
  standalone: true,
  imports: [CommonModule,RouterModule], // Include necessary modules here
  templateUrl: './teacher-registration.component.html',
  styleUrls: ['./teacher-registration.component.scss']
})
export class TeacherRegistrationComponent implements OnInit {
  @Output('scrolltocontact')
  scrolltocontact: EventEmitter<HTMLElement> = new EventEmitter<HTMLElement>();

  constructor() { }

  ngOnInit(): void {

  }
scroll(id:any){
  this.scrolltocontact.emit(id);
}
}
