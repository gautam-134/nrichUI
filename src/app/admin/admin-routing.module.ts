import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditInstituteComponent } from '../common/add-edit-institute/add-edit-institute.component';
import { AddUserComponent } from '../common/add-user/add-user.component';
import { BatchesComponent } from '../common/batches/batches.component';
import { AddEditBlogComponent } from '../common/blog-listing/add-edit-blog/add-edit-blog.component';
import { BlogListingComponent } from '../common/blog-listing/blog-listing.component';
import { BulkUserUploadComponent } from '../common/bulk-user-upload/bulk-user-upload.component';
import { ClassConfigurationComponent } from '../common/class-configuration/class-configuration.component';
import { ScheduleClassListComponent } from '../common/class-configuration/schedule-class-list/schedule-class-list.component';
import { CourseWizardComponent } from '../common/course-wizard/course-wizard.component';
import { CoursesComponent } from '../common/courses/courses.component';
import { EnrolledStudentsComponent } from '../common/enrolled-students/enrolled-students.component';
import { ExplorePlansComponent } from '../common/explore-plans/explore-plans.component';
import { FileManagementComponent } from '../common/file-management/file-management.component';
import { AddAchieverComponent } from '../common/institute-achievers-listing/add-achiever/add-achiever.component';
import { InstituteAchieversListingComponent } from '../common/institute-achievers-listing/institute-achievers-listing.component';
import { OnBoardingPageComponent } from '../common/on-boarding-page/on-boarding-page.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { QuizSubmitByComponent } from '../common/quiz-submit-by/quiz-submit-by.component';
import { ReportsComponent } from '../common/reports/reports.component';
import { SupportPageComponent } from '../common/support-page/support-page.component';
import { UserListingComponent } from '../common/user-listing/user-listing.component';
import { SettingsComponent } from '../settings/settings.component';
import { MyReferralCodeDetailsComponent } from '../StandaloneComponents/my-referral-code-details/my-referral-code-details.component';
import { AssignmentSudmitbyComponent } from '../teacher/assignment/assignment-sudmitby/assignment-sudmitby.component';
import { AssignmentComponent } from '../teacher/assignment/assignment.component';
import { DemoStudentRequestComponent } from '../teacher/demo-student-request/demo-student-request.component';
import { AddMaterialComponent } from '../teacher/material-listing/add-material/add-material.component';
import { MaterialListingComponent } from '../teacher/material-listing/material-listing.component';
import { QuizCreationComponent } from '../teacher/quiz-creation/quiz-creation.component';
import { QuizPreviewComponent } from '../teacher/quiz-creation/quiz-preview/quiz-preview.component';
import { QuizListComponent } from '../teacher/quiz-list/quiz-list.component';
import { ClassDetailsComponent } from '../teacher/teacher-dashboard/all-material/class-details/class-details.component';
import { AddEditRolesComponent } from './add-edit-roles/add-edit-roles.component';
import { AdminEnrollmentDetailsComponent } from './admin-enrollment/admin-enrollment-details/admin-enrollment-details.component';
import { AdminEnrollmentComponent } from './admin-enrollment/admin-enrollment.component';
import { AdminComponent } from './admin.component';
import { DashboardParentComponent } from './dashboard-parent/dashboard-parent.component';
import { ManageInstituteBlogsComponent } from './manage-institute-blogs/manage-institute-blogs.component';
import { OfflineEnrollmentComponent } from './offline-enrollment/offline-enrollment.component';
import { RolesComponent } from './roles/roles.component';
import { ScreenMappingComponent } from './screen-mapping/screen-mapping.component';
import { CreateStudentTeacherNotificationComponent } from '../common/student-teacher-notification/create-student-teacher-notification/create-student-teacher-notification.component';
import { StudentTeacherNotificationComponent } from '../common/student-teacher-notification/student-teacher-notification.component';
import { NotifiedUsersComponent } from '../common/student-teacher-notification/notified-users/notified-users.component';
import { PrerecordedModulesComponent } from '../common/prerecorded-modules/prerecorded-modules.component';
import { CreatePrerecordedModuleComponent } from '../common/create-prerecorded-module/create-prerecorded-module.component';
import { PrerecordedpreviewComponent } from '../common/prerecordedpreview/prerecordedpreview.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'roles',
        pathMatch: 'full',
        component: RolesComponent,
      },
      {
        path: 'add-role',
        component: AddEditRolesComponent,
      },
      {
        path: 'screen-mapping',
        component: ScreenMappingComponent,
      },
      {
        path: 'institutes',
        component: AddEditInstituteComponent,
      },
      {
        path: 'courses',
        component: CoursesComponent,
      },
      { path: 'demo-request', component: DemoStudentRequestComponent },
      {
        path: 'users',
        component: UserListingComponent,
      },
      {
        path: 'add-user',
        component: AddUserComponent,
      },
      { path: 'schedule-list', component: ScheduleClassListComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'classes', component: ClassConfigurationComponent },
      { path: 'material', component: MaterialListingComponent },
      { path: 'assignments', component: AssignmentComponent },
      { path: 'create-course', component: CourseWizardComponent },
      { path: 'add-material', component: AddMaterialComponent },
      { path: 'quiz-creation', component: QuizCreationComponent },
      { path: 'quiz', component: QuizListComponent },
      { path: 'offline-enrollment', component: OfflineEnrollmentComponent },
      { path: 'submit-by/:id', component: AssignmentSudmitbyComponent },
      { path: 'quiz-submit-by', component: QuizSubmitByComponent },
      {
        path: 'enrollments',
        component: AdminEnrollmentComponent,
      },
      {
        path: 'all-info',
        component: AdminEnrollmentDetailsComponent,
      },
      {
        path: 'batches',
        component: BatchesComponent,
      },
      { path: 'class-details/:classId', component: ClassDetailsComponent },
      {
        path: 'file',
        component: FileManagementComponent,
      },
      {
        path: 'bulk-users-upload',
        component: BulkUserUploadComponent,
      },
      {
        path: 'quiz-preview',
        component: QuizPreviewComponent,
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
        path: 'explore-plans',
        component: ExplorePlansComponent,
      },
      {
        path: 'enrolled-students',
        component: EnrolledStudentsComponent,
      },
      {
        path: 'achievers-listing',
        component: InstituteAchieversListingComponent,
      },
      {
        path: 'add-achiever',
        component: AddAchieverComponent,
      },
      {
        path: 'blog-listing',
        component: BlogListingComponent,
      },
      {
        path: 'add-blog',
        component: AddEditBlogComponent,
      },
      {
        path: 'institute-blogs-listing',
        component: ManageInstituteBlogsComponent,
      },
      {
        path: 'dashboard',
        component: DashboardParentComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'my-referral-details',
        component: MyReferralCodeDetailsComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'institute-notification',
        component: StudentTeacherNotificationComponent,
      },
      {
        path: 'create-notification',
        component: CreateStudentTeacherNotificationComponent,
      },
      {
        path: 'notified-users',
        component: NotifiedUsersComponent,
      },
      {
        path: 'prerecorded-modules',
        component: PrerecordedModulesComponent,
      },
      {
        path: 'create-modules',
        component: CreatePrerecordedModuleComponent,
      },
      {
        path: 'module-preview',
        component: PrerecordedpreviewComponent,
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
export class AdminRoutingModule {}
