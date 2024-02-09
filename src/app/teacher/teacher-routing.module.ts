import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchesComponent } from '../common/batches/batches.component';
import { AddEditBlogComponent } from '../common/blog-listing/add-edit-blog/add-edit-blog.component';
import { BlogListingComponent } from '../common/blog-listing/blog-listing.component';
import { ClassConfigurationComponent } from '../common/class-configuration/class-configuration.component';
import { ScheduleClassListComponent } from '../common/class-configuration/schedule-class-list/schedule-class-list.component';
import { CourseWizardComponent } from '../common/course-wizard/course-wizard.component';
import { CoursesComponent } from '../common/courses/courses.component';
import { EnrolledStudentsComponent } from '../common/enrolled-students/enrolled-students.component';
import { OnBoardingPageComponent } from '../common/on-boarding-page/on-boarding-page.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { QuizSubmitByComponent } from '../common/quiz-submit-by/quiz-submit-by.component';
import { SupportPageComponent } from '../common/support-page/support-page.component';
import { UserTransactionHistoryComponent } from '../common/user-transaction-history/user-transaction-history.component';
import { MyReferralCodeDetailsComponent } from '../StandaloneComponents/my-referral-code-details/my-referral-code-details.component';
import { AssignmentSudmitbyComponent } from './assignment/assignment-sudmitby/assignment-sudmitby.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { CreateCourseRequestComponent } from './create-course-request/create-course-request.component';
import { DemoStudentRequestComponent } from './demo-student-request/demo-student-request.component';
import { LiveClassComponent } from './live-class/live-class.component';
import { AddMaterialComponent } from './material-listing/add-material/add-material.component';
import { MaterialListingComponent } from './material-listing/material-listing.component';
import { QuizCreationComponent } from './quiz-creation/quiz-creation.component';
import { QuizPreviewComponent } from './quiz-creation/quiz-preview/quiz-preview.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { TeacherCourseListComponent } from './teacher-course-list/teacher-course-list.component';
import { TeacherDashboardAnaylticsComponent } from './teacher-dashboard-anayltics/teacher-dashboard-anayltics.component';
import { AllMaterialComponent } from './teacher-dashboard/all-material/all-material.component';
import { ClassDetailsComponent } from './teacher-dashboard/all-material/class-details/class-details.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { TeacherComponent } from './teacher.component';
import { ReportsComponent } from '../common/reports/reports.component';
// import { SendCourseRequestComponent } from './send-course-request/send-course-request.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    children: [
      {
        path: 'enrollments',
        pathMatch: 'full',
        component: TeacherDashboardComponent,
      },
      { path: 'live-class', component: LiveClassComponent },
      { path: 'teacher-course-list', component: TeacherCourseListComponent },
      { path: 'classes', component: ClassConfigurationComponent },
      {
        path: 'create-course-request',
        component: CreateCourseRequestComponent,
      },
      { path: 'all-info', component: AllMaterialComponent },
      { path: 'assignments', component: AssignmentComponent },
      { path: 'material', component: MaterialListingComponent },
      { path: 'add-material', component: AddMaterialComponent },
      { path: 'quiz', component: QuizListComponent },
      { path: 'quiz-creation', component: QuizCreationComponent },
      { path: 'schedule-list', component: ScheduleClassListComponent },
      { path: 'submit-by/:id', component: AssignmentSudmitbyComponent },
      { path: 'quiz-submit-by', component: QuizSubmitByComponent },
      { path: 'demo-request', component: DemoStudentRequestComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'create-course', component: CourseWizardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'class-details/:classId', component: ClassDetailsComponent },
      { path: 'batches', component: BatchesComponent },

      {
        path: 'transactions-history',
        component: UserTransactionHistoryComponent,
      },
      {
        path: 'quiz-preview',
        component: QuizPreviewComponent,
      },
      {
        path: 'enrolled-students',
        component: EnrolledStudentsComponent,
      },
      {
        path: 'support',
        component: SupportPageComponent,
      },
      {
        path: 'onboard',
        component: OnBoardingPageComponent,
      },
      {
        path: 'dashboard',
        component: TeacherDashboardAnaylticsComponent,
      },
      {
        path: 'blog-listing',
        component: BlogListingComponent,
      },
      {
        path:'add-blog',
        component:AddEditBlogComponent
      },
      {
        path:'my-referral-details',
        component:MyReferralCodeDetailsComponent
      },
      {
        path:'reports',
        component:ReportsComponent,
      },
      {
        path: 'social-connect',
        loadChildren: () =>
          import('../social-connect/social-connect.module').then(
            (m) => m.SocialConnectModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
