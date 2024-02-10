import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule2 } from '../common/common.module';
import { AddEditCouponComponent } from './coupon-code/add-edit-coupon/add-edit-coupon.component';
import { CouponCodeComponent } from './coupon-code/coupon-code.component';
import { CouponDetailsComponent } from './coupon-code/coupon-details/coupon-details.component';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionComponent } from './subscription.component';
import { ImageCropperModule } from 'ngx-image-cropper';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AddEditAddonnsComponent } from './add-onn/add-edit-addonns/add-edit-addonns.component';
import { AddOnnComponent } from './add-onn/add-onn.component';
import { AddEditPlanComponent } from './subscription-plan/add-edit-plan/add-edit-plan.component';
import { SubscriptionPlanComponent } from './subscription-plan/subscription-plan.component';
import { AddEditTrialplanComponent } from './trial-plan/add-edit-trialplan/add-edit-trialplan.component';
import { TrialPlanComponent } from './trial-plan/trial-plan.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AddFaqsComponent } from './add-faqs/add-faqs.component';
import { AdminDetailsComponent } from './all-users/all-admins/admin-details/admin-details.component';
import { AllAdminsComponent } from './all-users/all-admins/all-admins.component';
import { AllStudentsComponent } from './all-users/all-students/all-students.component';
import { StudentDetailsComponent } from './all-users/all-students/student-details/student-details.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { BlogsManagementComponent } from './blogs-management/blogs-management.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { FaqListingComponent } from './faq-listing/faq-listing.component';
import { InstituteManagementComponent } from './institute-management/institute-management.component';
import { EditCurrentPlanComponent } from './institutes-plan/edit-current-plan/edit-current-plan.component';
import { InstitutesPlanComponent } from './institutes-plan/institutes-plan.component';
import { NewCategoryRequestManagementComponent } from './new-category-request-management/new-category-request-management.component';
import { TeacherManagementComponent } from './teacher-management/teacher-management.component';
import { BannerManagementComponent } from './banner-management/banner-management.component';
import { CreateBannerComponent } from './banner-management/create-banner/create-banner.component';
import { BannerCropDialogComponent } from './banner-management/create-banner/banner-crop-dialog/banner-crop-dialog.component';
import { SubmitOfflinePaymentTransactionComponent } from './institute-management/submit-offline-payment-transaction/submit-offline-payment-transaction.component';
import { ChangeInstituteAdminOfInstituteComponent } from './institute-management/change-institute-admin-of-institute/change-institute-admin-of-institute.component';

@NgModule({
  declarations: [
    SubscriptionComponent,
    CouponCodeComponent,
    AddEditCouponComponent,
    CouponDetailsComponent,
    AddOnnComponent,
    AddEditAddonnsComponent,
    SubscriptionPlanComponent,
    AddEditPlanComponent,
    TrialPlanComponent,
    AddEditTrialplanComponent,
    CourseManagementComponent,
    TeacherManagementComponent,
    InstituteManagementComponent,
    AddFaqsComponent,
    FaqListingComponent,
    AllStudentsComponent,
    AllAdminsComponent,
    AdminDetailsComponent,
    AllUsersComponent,
    StudentDetailsComponent,
    BlogsManagementComponent,
    // InstitutesPlanComponent,
    EditCurrentPlanComponent,
    NewCategoryRequestManagementComponent,
    BannerManagementComponent,
    CreateBannerComponent,
    BannerCropDialogComponent,
    SubmitOfflinePaymentTransactionComponent,
    ChangeInstituteAdminOfInstituteComponent,
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    CommonModule2,
    MatDialogModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    MatMenuModule,
    FormsModule,
    ImageCropperModule
  ],
  providers: [DatePipe],
})
export class SubscriptionModule {}
