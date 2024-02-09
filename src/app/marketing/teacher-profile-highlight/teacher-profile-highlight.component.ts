import { Component, Input, OnInit } from '@angular/core';
import { teacherDetails } from 'src/app/model/teacher-info';

@Component({
  selector: 'app-teacher-profile-highlight',
  standalone: true,
  imports: [],
  templateUrl: './teacher-profile-highlight.component.html',
  styleUrl: './teacher-profile-highlight.component.scss'
})
export class TeacherProfileHighlightComponent implements OnInit {

  @Input('teacherDetails') teacherDetails!:teacherDetails;
  constructor() { }

  ngOnInit(): void {
  }
  gotolinkedin(link:any){
    window.open(link, '_blank');

  }
}

