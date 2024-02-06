import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';

import { BlogInfoComponent } from './blogs-list/blog-info/blog-info.component';
import { BlogsListComponent } from './blogs-list/blogs-list.component';
import { ContactNrichComponent } from './contact-us/contact-nrich.component';
import { CourseFilterComponent } from './course-filter/course-filter.component';
import { CoursePageComponent } from './course-page/course-page.component';
import { CategoryCoursesComponent } from './course-selection/category-courses/category-courses.component';
import { CourseSelectionComponent } from './course-selection/course-selection.component';
import { SubCategoriesComponent } from './course-selection/sub-categories/sub-categories.component';
import { SubSubCategoriesComponent } from './course-selection/sub-sub-categories/sub-sub-categories.component';
import { EducatorFilterComponent } from './educator-filter/educator-filter.component';
import { AllfeaturesComponent } from './home/allfeatures/allfeatures.component';
import { HomeComponent } from './home/home.component';
import { LmsComponent } from './home/lms/lms.component';
import { InstituteFilterComponent } from './institute-filter/institute-filter.component';
import { InstitutePageComponent } from './institute-page/institute-page.component';
import { MarketingPlansComponent } from './marketing-plans/marketing-plans.component';
import { MarketingComponent } from './marketing.component';
import { NrichAppWebsiteComponent } from './nrich-app-website/nrich-app-website.component';
import { NrichBenifitsComponent } from './nrich-benifits/nrich-benifits.component';
import { NrichDigitalLibraryComponent } from './nrich-digital-library/nrich-digital-library.component';
import { NrichForInstituteComponent } from './nrich-for-institute/nrich-for-institute.component';
import { NrichForSchoolComponent } from './nrich-for-school/nrich-for-school.component';
import { NrichForStudentComponent } from './nrich-for-student/nrich-for-student.component';
import { NrichLegalContactComponent } from './nrich-legal-contact/nrich-legal-contact.component';
import { NrichMeetComponent } from './nrich-meet/nrich-meet.component';
import { NrichSocialConnectComponent } from './nrich-social-connect/nrich-social-connect.component';
import { SmsComponent } from './sms/sms.component';
import { CheckoutComponent } from './subscription-plan/checkout/checkout.component';
import { SubscriptionPlanComponent } from './subscription-plan/subscription-plan.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { NrichCrmComponent } from './nrich-crm/nrich-crm.component';

const routes: Routes = [
  {
    path: '',
    component: MarketingComponent,
    children: [
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
      },
      { path: '', component: HomeComponent },
      { path: 'teacher-profile', component: TeacherProfileComponent },
      { path: 'institute-info', component: InstitutePageComponent },
      { path: 'course-info', component: CoursePageComponent },
      {
        path: 'categories',
        component: CourseSelectionComponent,
        children: [
          { path: 'subCategories', component: SubCategoriesComponent },
          { path: 'subSubCategories', component: SubSubCategoriesComponent },
          { path: 'categoryCourses', component: CategoryCoursesComponent },
        ],
      },
      { path: 'educator-list', component: EducatorFilterComponent },
      { path: 'institute-list', component: InstituteFilterComponent },
      { path: 'course-list', component: CourseFilterComponent },
      { path: 'blog-list', component: BlogsListComponent },
      { path: 'blog-details', component: BlogInfoComponent },
      {
        path: 'online-platform-for-teaching',
        component: SubscriptionPlanComponent,
      },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'about-nrich', component: AboutUsComponent },
      { path: 'connect-with-learning', component: ContactNrichComponent },
      {
        path: 'Find-courses-for-students-online',
        component: NrichForStudentComponent,
      },
      { path: 'management-software-for-schools', component: NrichForSchoolComponent },
      { path: 'management-tools-for-educational-Institutes', component: NrichForInstituteComponent },
      { path: 'digital-library', component: NrichDigitalLibraryComponent },
      { path: 'social-media-platform', component: NrichSocialConnectComponent },
      {
        path: 'online-education-advantage',
        component: NrichBenifitsComponent,
      },
      { path: 'get-a-white-labelled-app-for-teaching', component: NrichAppWebsiteComponent },
      { path: 'online-live-streaming-platform-for-teachers', component: NrichMeetComponent },
      { path: 'legal-contact', component: NrichLegalContactComponent },
      {
        path: 'learning-management-software',
        component: LmsComponent,
      },
      {
        path: 'features-of-management-tool',
        component: AllfeaturesComponent,
      },
      { path: 'sms', component: SmsComponent },
      {
        path: 'pricing-for-learning-management-system',
        component: MarketingPlansComponent,
      },
      { path: 'nrich-crm', component: NrichCrmComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingRoutingModule {}
