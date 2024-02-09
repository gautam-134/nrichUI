import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-creation',
  standalone: true,
  imports: [],
  templateUrl: './quiz-creation.component.html',
  styleUrl: './quiz-creation.component.scss'
})
export class QuizCreationComponent implements OnInit, OnDestroy {
  previewSubscription!: Subscription;
  isPreview: boolean = false;

  constructor(private location: Location) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {}

  cancel() {
    this.location.back();
  }
}

