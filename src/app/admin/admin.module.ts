import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CommonModule2 } from '../common/common.module';
import { AddEditRolesComponent } from './add-edit-roles/add-edit-roles.component';
import { AdminAllAssignmentsComponent } from './admin-enrollment/admin-enrollment-details/admin-all-assignments/admin-all-assignments.component';
import { AdminAllMaterialComponent } from './admin-enrollment/admin-enrollment-details/admin-all-material/admin-all-material.component';
import { AdminAllQuizComponent } from './admin-enrollment/admin-enrollment-details/admin-all-quiz/admin-all-quiz.component';
import { AdminClassesComponent } from './admin-enrollment/admin-enrollment-details/admin-classes/admin-classes.component';
import { AdminDemoclassesComponent } from './admin-enrollment/admin-enrollment-details/admin-democlasses/admin-democlasses.component';
import { AdminEnrollmentDetailsComponent } from './admin-enrollment/admin-enrollment-details/admin-enrollment-details.component';
import { AdminWebinarsComponent } from './admin-enrollment/admin-enrollment-details/admin-webinars/admin-webinars.component';
import { AdminEnrollmentComponent } from './admin-enrollment/admin-enrollment.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CourseCategoryManagementComponent } from './course-category-management/course-category-management.component';
import { CreateCategoryComponent } from './course-category-management/create-category/create-category.component';
import { CreateSubCategoryComponent } from './course-category-management/sub-category-management/create-sub-category/create-sub-category.component';
import { SubCategoryManagementComponent } from './course-category-management/sub-category-management/sub-category-management.component';
import { CreateSubSubCategoryComponent } from './course-category-management/sub-category-management/sub-sub-category-management/create-sub-sub-category/create-sub-sub-category.component';
import { SubSubCategoryManagementComponent } from './course-category-management/sub-category-management/sub-sub-category-management/sub-sub-category-management.component';
import { AdminDashboardAnalyticsComponent } from './dashboard-parent/admin-dashboard-analytics/admin-dashboard-analytics.component';
import { DashboardParentComponent } from './dashboard-parent/dashboard-parent.component';
import { InstituteAdminDashboardAnalyticsComponent } from './dashboard-parent/institute-admin-dashboard-analytics/institute-admin-dashboard-analytics.component';
import { ManageInstituteBlogsComponent } from './manage-institute-blogs/manage-institute-blogs.component';
import { OfflineEnrollmentComponent } from './offline-enrollment/offline-enrollment.component';
import { RolesComponent } from './roles/roles.component';
import { ScreenMappingComponent } from './screen-mapping/screen-mapping.component';

@NgModule({
  declarations: [
    AdminComponent,
    RolesComponent,
    AddEditRolesComponent,
    ScreenMappingComponent,
    OfflineEnrollmentComponent,
    AdminEnrollmentComponent,
    AdminEnrollmentDetailsComponent,
    AdminClassesComponent,
    AdminDemoclassesComponent,
    AdminAllAssignmentsComponent,
    AdminAllMaterialComponent,
    AdminAllQuizComponent,
    CourseCategoryManagementComponent,
    CreateCategoryComponent,
    SubCategoryManagementComponent,
    SubSubCategoryManagementComponent,
    CreateSubCategoryComponent,
    CreateSubSubCategoryComponent,
    AdminWebinarsComponent,
    ManageInstituteBlogsComponent,
    AdminDashboardAnalyticsComponent,
    InstituteAdminDashboardAnalyticsComponent,
    DashboardParentComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CommonModule2,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    MatPaginatorModule,
    MatMenuModule,
    ReactiveFormsModule,
    ImageCropperModule,
    NgApexchartsModule
  ],
})
export class AdminModule {}
