import { Component, Input, OnInit } from '@angular/core';
import { InstituteDetails } from '../../model/institute-details';

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss']
})
export class HighlightsComponent implements OnInit {
  @Input('instituteDetails') instituteDetails!:InstituteDetails;
  constructor() { }

  ngOnInit(): void {
  }

}
