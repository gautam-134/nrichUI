import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoursePageComponent } from './course-page/course-page.component';
import { CourseSelectionComponent } from './course-selection/course-selection.component';
import { HomeComponent } from './home/home.component';
import { InstitutePageComponent } from './institute-page/institute-page.component';
import { MarketingRoutingModule } from './marketing-routing.module';
import { MarketingFooterComponent } from './shared/marketing-footer/marketing-footer.component';
import { MarketingHeaderComponent } from './shared/marketing-header/marketing-header.component';
import { NavigationMenuComponent } from './shared/navigation-menu/navigation-menu.component';

import { CourseFilterComponent } from './course-filter/course-filter.component';
import { CourseListComponent } from './course-filter/course-list/course-list.component';
import { BookDemoComponent } from './course-page/book-demo/book-demo.component';
import { CourseVideoComponent } from './course-page/course-video/course-video.component';
import { PricingPlansComponent } from './course-page/pricing-plans/pricing-plans.component';
import { RelatedCoursesComponent } from './course-page/related-courses/related-courses.component';
import { CategoryCoursesComponent } from './course-selection/category-courses/category-courses.component';
import { SubCategoriesComponent } from './course-selection/sub-categories/sub-categories.component';
import { SubSubCategoriesComponent } from './course-selection/sub-sub-categories/sub-sub-categories.component';
import { EducatorFilterComponent } from './educator-filter/educator-filter.component';
import { EducatorListComponent } from './educator-filter/educator-list/educator-list.component';
import { CategoriesComponent } from './home/categories/categories.component';
import { ContactUsComponent } from './home/contact-us/contact-us.component';
import { EducatorsComponent } from './home/educators/educators.component';
import { ExpertsComponent } from './home/experts/experts.component';
import { HomeCoursesComponent } from './home/home-courses/home-courses.component';
import { HomeSearchComponent } from './home/home-search/home-search.component';
import { InstitutesComponent } from './home/institutes/institutes.component';
import { InstituteFilterComponent } from './institute-filter/institute-filter.component';
import { InstituteListComponent } from './institute-filter/institute-list/institute-list.component';
import { AchieversSliderComponent } from './shared/achievers-slider/achievers-slider.component';
import { BlogsComponent } from './shared/blogs/blogs.component';
import { CourseSliderComponent } from './shared/course-slider/course-slider.component';
import { EducatorSliderComponent } from './shared/educator-slider/educator-slider.component';
import { FaqComponent } from './shared/faq/faq.component';
import { HighlightsComponent } from './shared/highlights/highlights.component';
import { InquiryFormComponent } from './shared/inquiry-form/inquiry-form.component';
import { InstituteSliderComponent } from './shared/institute-slider/institute-slider.component';
import { ReviewSliderComponent } from './shared/review-slider/review-slider.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { CommonModule2 } from '../common/common.module';
import { BlogsListComponent } from './blogs-list/blogs-list.component';
import { BuyCourseComponent } from './course-page/buy-course/buy-course.component';
import { ReviewsComponent } from './shared/reviews/reviews.component';
import { WebinarSliderComponent } from './shared/webinar-slider/webinar-slider.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { TeacherReviewsComponent } from './teacher-profile/teacher-reviews/teacher-reviews.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { AboutUsComponent } from './about-us/about-us.component';
import { TeamSliderComponent } from './about-us/team-slider/team-slider.component';
import { ContactNrichComponent } from './contact-us/contact-nrich.component';
import { LmsCrousalComponent } from './home/lms/lms-crousal/lms-crousal.component';
import { LmsSignUpComponent } from './home/lms/lms-sign-up/lms-sign-up.component';
import { LmsComponent } from './home/lms/lms.component';
import { InstituteAchieversSliderComponent } from './institute-page/institute-achievers-slider/institute-achievers-slider.component';
import { NrichAppWebsiteComponent } from './nrich-app-website/nrich-app-website.component';
import { NrichBenifitsComponent } from './nrich-benifits/nrich-benifits.component';
import { DigitalLibrarySearchComponent } from './nrich-digital-library/digital-library-search/digital-library-search.component';
import { NrichDigitalLibraryComponent } from './nrich-digital-library/nrich-digital-library.component';
import { InstituteContactUsComponent } from './nrich-for-institute/institute-contact-us/institute-contact-us.component';
import { NrichForInstituteComponent } from './nrich-for-institute/nrich-for-institute.component';
import { NrichForSchoolComponent } from './nrich-for-school/nrich-for-school.component';
import { SchoolContactUsComponent } from './nrich-for-school/school-contact-us/school-contact-us.component';
import { SchoolPlatformTabsComponent } from './nrich-for-school/school-platform-tabs/school-platform-tabs.component';
import { SchoolSearchComponent } from './nrich-for-school/school-search/school-search.component';
import { NrichForStudentComponent } from './nrich-for-student/nrich-for-student.component';
import { StudentContactUsComponent } from './nrich-for-student/student-contact-us/student-contact-us.component';
import { StudentSearchComponent } from './nrich-for-student/student-search/student-search.component';
import { StudentStaticContentComponent } from './nrich-for-student/student-static-content/student-static-content.component';
import { NrichForTeacherComponent } from './nrich-for-teacher/nrich-for-teacher.component';
import { NrichLegalContactComponent } from './nrich-legal-contact/nrich-legal-contact.component';
import { NrichMeetComponent } from './nrich-meet/nrich-meet.component';
import { PlaystoreMobileComponent } from './nrich-meet/playstore-mobile/playstore-mobile.component';
import { NrichSocialConnectComponent } from './nrich-social-connect/nrich-social-connect.component';
import { CommenPlayStoreCardComponent } from './shared/commen-play-store-card/commen-play-store-card.component';
import { MobileSocialSliderComponent } from './shared/mobile-social-slider/mobile-social-slider.component';
import { SmsSearchComponent } from './sms/sms-search/sms-search.component';
import { SmsSliderComponent } from './sms/sms-slider/sms-slider.component';
import { SmsComponent } from './sms/sms.component';
import { Carousel1Component } from './subscription-plan/carousel1/carousel1.component';
import { CheckoutComponent } from './subscription-plan/checkout/checkout.component';
import { ConfirmationComponent } from './subscription-plan/checkout/confirmation/confirmation.component';
import { ContactInformationComponent } from './subscription-plan/checkout/contact-information/contact-information.component';
import { PaymentComponent } from './subscription-plan/checkout/payment/payment.component';
import { SubscriptionContactUsComponent } from './subscription-plan/subscription-contact-us/subscription-contact-us.component';
import { SubscriptionPlanSearchComponent } from './subscription-plan/subscription-plan-search/subscription-plan-search.component';
import { SubscriptionPlanComponent } from './subscription-plan/subscription-plan.component';
import { TeacherProfileHighlightComponent } from './teacher-profile-highlight/teacher-profile-highlight.component';
import { MarketingPlansComponent } from './marketing-plans/marketing-plans.component';
import { TeachOnlineCrousalComponent } from './home/lms/teach-online-crousal/teach-online-crousal.component'
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AllfeaturesComponent } from './home/allfeatures/allfeatures.component';
import { NrichCrmComponent } from './nrich-crm/nrich-crm.component';
import { ScrollableDivDirective } from '../directives/scrollable-div.directive';

@NgModule({
  declarations: [
    MarketingHeaderComponent,
    MarketingFooterComponent,
    NavigationMenuComponent,
    HomeComponent,
    InstitutePageComponent,
    CoursePageComponent,
    CourseSelectionComponent,
    HomeSearchComponent,
    ContactUsComponent,
    ContactNrichComponent,
    CategoriesComponent,
    CourseSliderComponent,
    EducatorSliderComponent,
    InstituteSliderComponent,
    HomeCoursesComponent,
    EducatorsComponent,
    InstitutesComponent,
    ExpertsComponent,
    FaqComponent,
    BlogsComponent,

    InquiryFormComponent,
    CourseVideoComponent,
    PricingPlansComponent,
    RelatedCoursesComponent,
    BookDemoComponent,
    ReviewSliderComponent,
    HighlightsComponent,
    AchieversSliderComponent,
    CourseFilterComponent,
    EducatorFilterComponent,
    InstituteFilterComponent,
    CourseListComponent,
    EducatorListComponent,
    InstituteListComponent,
    CategoryCoursesComponent,
    SubCategoriesComponent,
    SubSubCategoriesComponent,
    TeacherProfileComponent,
    ReviewsComponent,
    TeacherReviewsComponent,
    BuyCourseComponent,
    ReviewsComponent,
    BlogsListComponent,
    WebinarSliderComponent,
    SubscriptionPlanComponent,
    CheckoutComponent,
    AboutUsComponent,
    NrichForStudentComponent,
    NrichForInstituteComponent,
    NrichForTeacherComponent,
    NrichForSchoolComponent,
    NrichDigitalLibraryComponent,
    NrichSocialConnectComponent,
    NrichBenifitsComponent,
    NrichAppWebsiteComponent,
    NrichMeetComponent,
    NrichLegalContactComponent,
    ContactInformationComponent,
    PaymentComponent,
    ConfirmationComponent,
    StudentSearchComponent,
    StudentContactUsComponent,
    StudentStaticContentComponent,
    SubscriptionContactUsComponent,
    SubscriptionPlanSearchComponent,
    Carousel1Component,
    MobileSocialSliderComponent,
    CommenPlayStoreCardComponent,
    TeacherProfileHighlightComponent,
    TeamSliderComponent,
    SchoolSearchComponent,
    SchoolContactUsComponent,
    SchoolPlatformTabsComponent,
    InstituteContactUsComponent,
    DigitalLibrarySearchComponent,
    LmsComponent,
    LmsSignUpComponent,
    LmsCrousalComponent,
    SmsComponent,
    SmsSearchComponent,
    SmsSliderComponent,
    PlaystoreMobileComponent,
    InstituteAchieversSliderComponent,
    MarketingPlansComponent,
    TeachOnlineCrousalComponent,
    AllfeaturesComponent,
    NrichCrmComponent,
    ScrollableDivDirective
  ],
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
    CommonModule2,
    NgxPaginationModule,
    MatAutocompleteModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    CarouselModule,
  ],
})
export class MarketingModule {}
