import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { MarketingRoutingModule } from './marketing-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
@Component({
  selector: 'app-marketing',
  standalone: true,
  imports: [
    CommonModule,
    MarketingRoutingModule,
    SlickCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatExpansionModule,
    MatDialogModule,
    MatInputModule,
    NgxStarRatingModule,
    MatPaginatorModule,
    // CommonModule2,
    NgxPaginationModule,
    MatAutocompleteModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    CarouselModule,
  ],
  
  templateUrl: './marketing.component.html',
  styleUrl: './marketing.component.scss'
})
export class MarketingComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit(): void {
    // AuthService.whatsappSubject$.next(true);
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) window.scrollTo(0, +scrollPosition);
    localStorage.removeItem('scrollPosition');
  }
  
  ngOnDestroy(): void {
    // AuthService.whatsappSubject$.next(false);
  }
}