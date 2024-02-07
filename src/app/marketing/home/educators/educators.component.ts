import { Component, OnInit } from '@angular/core';
import { TeachersList } from 'src/app/model/feature-home-teacher.model';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-educators',
  standalone: true,
  imports: [],
  templateUrl: './educators.component.html',
  styleUrl: './educators.component.scss'
})
export class EducatorsComponent implements OnInit {
  teacherList: TeachersList[] = [];

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.teacherService.fetchTeachersList().subscribe((data: any) => {
      this.teacherList = data.teachers;
    });
  }
}