import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { CourseVO } from '../../model/CourseVO';

@Component({
  selector: 'app-course-video',
   
  templateUrl: './course-video.component.html',
  styleUrl: './course-video.component.scss'
})
export class CourseVideoComponent implements OnInit, OnChanges {
  @Input('courseDetails') courseDetails?: CourseVO;
  @Output() newItemEvent = new EventEmitter();
  youTubeLink!: string;
  defaultVideoLink!: string;

  constructor() {}

  ngOnInit(): void {
    this.youTubeLink = this.courseDetails?.youtubeVideoLink?.replace(
      '/watch?v=',
      '/embed/'
    ) as string;
  }
  ngOnChanges() {
    this.youTubeLink = this.courseDetails?.youtubeVideoLink?.replace(
      '/watch?v=',
      '/embed/'
    ) as string;
  }

  addNewItem() {
    this.newItemEvent.emit();
  }
}
