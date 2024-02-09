import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditRolesComponent } from '../admin/add-edit-roles/add-edit-roles.component';
import { AdminEnrollmentDetailsComponent } from '../admin/admin-enrollment/admin-enrollment-details/admin-enrollment-details.component';
import { AdminEnrollmentComponent } from '../admin/admin-enrollment/admin-enrollment.component';
import { CourseCategoryManagementComponent } from '../admin/course-category-management/course-category-management.component';
import { SubCategoryManagementComponent } from '../admin/course-category-management/sub-category-management/sub-category-management.component';
import { SubSubCategoryManagementComponent } from '../admin/course-category-management/sub-category-management/sub-sub-category-management/sub-sub-category-management.component';
import { DashboardParentComponent } from '../admin/dashboard-parent/dashboard-parent.component';
import { ManageInstituteBlogsComponent } from '../admin/manage-institute-blogs/manage-institute-blogs.component';
import { OfflineEnrollmentComponent } from '../admin/offline-enrollment/offline-enrollment.component';
import { RolesComponent } from '../admin/roles/roles.component';
import { ScreenMappingComponent } from '../admin/screen-mapping/screen-mapping.component';
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
import { CreateInstituteNotificationComponent } from '../common/institute-notification/create-institute-notification/create-institute-notification.component';
import { InstituteNotificationComponent } from '../common/institute-notification/institute-notification.component';
import { NotifiedInstitutesComponent } from '../common/institute-notification/notified-institutes/notified-institutes.component';
import { OnBoardingPageComponent } from '../common/on-boarding-page/on-boarding-page.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { QuizSubmitByComponent } from '../common/quiz-submit-by/quiz-submit-by.component';
import { ReportsComponent } from '../common/reports/reports.component';
import { SupportPageComponent } from '../common/support-page/support-page.component';
import { UserListingComponent } from '../common/user-listing/user-listing.component';
import { AssignmentSudmitbyComponent } from '../teacher/assignment/assignment-sudmitby/assignment-sudmitby.component';
import { AssignmentComponent } from '../teacher/assignment/assignment.component';
import { AddMaterialComponent } from '../teacher/material-listing/add-material/add-material.component';
import { MaterialListingComponent } from '../teacher/material-listing/material-listing.component';
import { QuizCreationComponent } from '../teacher/quiz-creation/quiz-creation.component';
import { QuizPreviewComponent } from '../teacher/quiz-creation/quiz-preview/quiz-preview.component';
import { QuizListComponent } from '../teacher/quiz-list/quiz-list.component';
import { ClassDetailsComponent } from '../teacher/teacher-dashboard/all-material/class-details/class-details.component';
import { AddFaqsComponent } from './add-faqs/add-faqs.component';
import { AddOnnComponent } from './add-onn/add-onn.component';
import { AdminDetailsComponent } from './all-users/all-admins/admin-details/admin-details.component';
import { AllStudentsComponent } from './all-users/all-students/all-students.component';
import { StudentDetailsComponent } from './all-users/all-students/student-details/student-details.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { BlogsManagementComponent } from './blogs-management/blogs-management.component';
import { AddEditCouponComponent } from './coupon-code/add-edit-coupon/add-edit-coupon.component';
import { CouponCodeComponent } from './coupon-code/coupon-code.component';
import { CouponDetailsComponent } from './coupon-code/coupon-details/coupon-details.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { FaqListingComponent } from './faq-listing/faq-listing.component';
import { InstituteManagementComponent } from './institute-management/institute-management.component';
import { EditCurrentPlanComponent } from './institutes-plan/edit-current-plan/edit-current-plan.component';
import { InstitutesPlanComponent } from './institutes-plan/institutes-plan.component';
import { NewCategoryRequestManagementComponent } from './new-category-request-management/new-category-request-management.component';
import { SubscriptionPlanComponent } from './subscription-plan/subscription-plan.component';
import { SubscriptionComponent } from './subscription.component';
import { TeacherManagementComponent } from './teacher-management/teacher-management.component';
import { BannerManagementComponent } from './banner-management/banner-management.component';
import { CreateBannerComponent } from './banner-management/create-banner/create-banner.component';
import { PrerecordedModulesComponent } from '../common/prerecorded-modules/prerecorded-modules.component';
import { CreatePrerecordedModuleComponent } from '../common/create-prerecorded-module/create-prerecorded-module.component';
import { SubmitOfflinePaymentTransactionComponent } from './institute-management/submit-offline-payment-transaction/submit-offline-payment-transaction.component';
import { ChangeInstituteAdminOfInstituteComponent } from './institute-management/change-institute-admin-of-institute/change-institute-admin-of-institute.component';
import { DemoStudentRequestComponent } from '../teacher/demo-student-request/demo-student-request.component';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionComponent,
    children: [
      { path: 'coupon-codes', component: CouponCodeComponent },
      { path: 'create-coupons', component: AddEditCouponComponent },
      { path: 'coupon-details', component: CouponDetailsComponent },
      { path: 'add-on', component: AddOnnComponent },
      { path: 'plan', component: SubscriptionPlanComponent },
      { path: 'file', component: FileManagementComponent },
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
      {
        path: 'users',
        component: UserListingComponent,
      },
      {
        path: 'add-user',
        component: AddUserComponent,
      },
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
      { path: 'schedule-list', component: ScheduleClassListComponent },
      {
        path: 'enrollments',
        component: AdminEnrollmentComponent,
      },
      { path: 'class-details/:classId', component: ClassDetailsComponent },
      {
        path: 'all-info',
        component: AdminEnrollmentDetailsComponent,
      },
      {
        path: 'batches',
        component: BatchesComponent,
      },
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
        path: 'teachers-management',
        component: TeacherManagementComponent,
      },
      {
        path: 'institute-management',
        component: InstituteManagementComponent,
      },
      {
        path: 'course-management',
        component: CourseManagementComponent,
      },
      {
        path: 'enrolled-students',
        component: EnrolledStudentsComponent,
      },
      {
        path: 'category-management',
        component: CourseCategoryManagementComponent,
      },
      {
        path: 'sub-category-management',
        component: SubCategoryManagementComponent,
      },
      {
        path: 'sub-sub-category-management',
        component: SubSubCategoryManagementComponent,
      },
      {
        path: 'add-faqs',
        component: AddFaqsComponent,
      },
      {
        path: 'faq-listing',
        component: FaqListingComponent,
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
        path: 'all-students',
        component: AllStudentsComponent,
      },
      {
        path: 'all-users',
        component: AllUsersComponent,
      },
      {
        path: 'admin-details',
        component: AdminDetailsComponent,
      },
      {
        path: 'student-details',
        component: StudentDetailsComponent,
      },
      {
        path: 'institute-notification',
        component: InstituteNotificationComponent,
      },
      {
        path: 'create-notification',
        component: CreateInstituteNotificationComponent,
      },
      {
        path: 'notified-institutes',
        component: NotifiedInstitutesComponent,
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
        path: 'blogs-management',
        component: BlogsManagementComponent,
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
        path: 'institutes-plan',
        component: InstitutesPlanComponent,
      },
      {
        path: 'institute-blogs-listing',
        component: ManageInstituteBlogsComponent,
      },
      {
        path: 'edit-plan',
        component: EditCurrentPlanComponent,
      },
      {
        path: 'category-requests',
        component: NewCategoryRequestManagementComponent,
      },
      {
        path: 'dashboard',
        component: DashboardParentComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'banners',
        component: BannerManagementComponent,
      },
      {
        path: 'create-banner',
        component: CreateBannerComponent,
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
        path: 'submit-offline-payment-details',
        component: SubmitOfflinePaymentTransactionComponent,
      },
      {
        path: 'change-institute-admin',
        component: ChangeInstituteAdminOfInstituteComponent,
      },
      { path: 'demo-request', component: DemoStudentRequestComponent },
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
export class SubscriptionRoutingModule {}
