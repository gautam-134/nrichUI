import {
  Component,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
} from '@angular/core';
import { SupportDetails } from '../../model/SupportDetails';

@Component({
  selector: 'app-support',
   
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent implements OnInit, OnChanges, AfterViewInit {
  @Input('supportDetails') details: SupportDetails[] = [];
  reference: SupportDetails | undefined;
  index: number = 0;

  constructor() {}
  ngAfterViewInit(): void {
    if (this.details) this.reference = this.details[0];
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (this.details) this.reference = this.details[0];
  }

  ngOnInit(): void {}

  nextButtonClick() {
    this.index = this.index + 1;
    this.reference = this.details[this.index];
  }

  previousButtonClick() {
    this.index = this.index - 1;
    this.reference = this.details[this.index];
  }
}
