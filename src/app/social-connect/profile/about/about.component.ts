import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MyProfile } from '../my-profile/my-profile.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, OnChanges {
  @Input() myProfile!: MyProfile;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.myProfile = changes?.['myProfile']?.['currentValue'];
  }

  ngOnInit(): void {
  }
}
