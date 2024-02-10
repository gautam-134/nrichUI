import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchesComponent } from '../common/batches/batches.component';
import { OnBoardingPageComponent } from '../common/on-boarding-page/on-boarding-page.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { SupportPageComponent } from '../common/support-page/support-page.component';
import { ClassDetailsComponent } from '../teacher/teacher-dashboard/all-material/class-details/class-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamComponent } from './exam/exam.component';
import { StudentDashboardInfoComponent } from './student-enrollment/student-dashboard-info/student-dashboard-info.component';
import { StudentEnrollmentComponent } from './student-enrollment/student-enrollment.component';
import { StudentComponent } from './student.component';
import { QuizPreviewComponent } from '../teacher/quiz-creation/quiz-preview/quiz-preview.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      { path: 'enrollments', component: StudentEnrollmentComponent },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'all-info',
        component: StudentDashboardInfoComponent,
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'exam/:id', component: ExamComponent },
      {
        path: 'support',
        component: SupportPageComponent,
      },
      {
        path: 'onboard',
        component: OnBoardingPageComponent,
      },
      { path: 'class-details/:classId', component: ClassDetailsComponent },
      { path: 'batches', component: BatchesComponent },
      {
        path: 'quiz-preview',
        component: QuizPreviewComponent,
      },
      {
        path: "purchase-history",
        component: PurchaseHistoryComponent
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
export class StudentRoutingModule {}
