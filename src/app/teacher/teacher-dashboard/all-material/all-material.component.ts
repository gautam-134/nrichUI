import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClassVO } from 'src/app/model/classVO';


@Component({
  selector: 'app-all-material',
  standalone: true,
  imports: [],
  templateUrl: './all-material.component.html',
  styleUrl: './all-material.component.scss'
})
export class AllMaterialComponent implements OnInit {
  courseId!: number;
  batchId!: number;
  page: number = 0;
  size: number = 10;
  searchParam: string = '';
  liveClassesVO!: ClassVO[];
  futureClassesVO!: ClassVO[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.queryParams?.['id'];
    this.batchId = +this.route.snapshot.queryParams?.['idbatch'];
  }
}
