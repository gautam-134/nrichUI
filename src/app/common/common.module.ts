import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCommonModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ClassConfigurationComponent } from './class-configuration/class-configuration.component';
import { ScheduleClassListComponent } from './class-configuration/schedule-class-list/schedule-class-list.component';
import { CommonRoutingModule } from './common-routing.module';
import { CommonComponent } from './common.component';
import { CreateEditClassConfigurationComponent } from './create-edit-class-configuration/create-edit-class-configuration.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { PaginationsComponent } from './paginations/paginations.component';
import { FilterPipe } from './pipes/filter.pipe';
import { InnerhtmltoplaintextPipe } from './pipes/innerhtmltoplaintext.pipe';
import { PaginatePipe } from './pipes/paginate.pipe';
import { SidebarComponent } from './sidebar/sidebar.component';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TagInputModule } from 'ngx-chips';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AddEditInstituteComponent } from './add-edit-institute/add-edit-institute.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AssignmentDocumentPreviewComponent } from './assignment-document-preview/assignment-document-preview.component';
import { AddEditBlogComponent } from './blog-listing/add-edit-blog/add-edit-blog.component';
import { BlogImageCropperComponent } from './blog-listing/blog-image-cropper/blog-image-cropper.component';
import { BlogListingComponent } from './blog-listing/blog-listing.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { BulkUserUploadComponent } from './bulk-user-upload/bulk-user-upload.component';
import { ClassMappingPageComponent } from './class-mapping-page/class-mapping-page.component';
import { AddEditCourseComponent } from './course-wizard/add-edit-course/add-edit-course.component';
import { RequestForOtherCategoryComponent } from './course-wizard/add-edit-course/request-for-other-category/request-for-other-category.component';
import { AddEditBatchesComponent } from './course-wizard/course-batches/add-edit-batches/add-edit-batches.component';
import { CourseBatchesComponent } from './course-wizard/course-batches/course-batches.component';
import { AddEditPricingplanComponent } from './course-wizard/course-pricing-plans/add-edit-pricingplan/add-edit-pricingplan.component';
import { CoursePricingPlansComponent } from './course-wizard/course-pricing-plans/course-pricing-plans.component';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { SupportComponent } from './course-wizard/support/support.component';
import { CoursesComponent } from './courses/courses.component';
import { DisabledCoursesComponent } from './courses/disabled-courses/disabled-courses.component';
import { CoverImageCropComponent } from './cover-image-crop/cover-image-crop.component';
import { DocumentPreviewComponent } from './document-preview/document-preview.component';
import { EnrolledStudentsComponent } from './enrolled-students/enrolled-students.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { CurrentPlanHistoryComponent } from './explore-plans/current-plan-history/current-plan-history.component';
import { ExplorePlansComponent } from './explore-plans/explore-plans.component';
import { FileManagementComponent } from './file-management/file-management.component';
import { PreviewComponent } from './file-management/preview/preview.component';
import { NotificationDetailsComponent } from './header/notification-details/notification-details.component';
import { ImageCropDialogComponent } from './image-crop-dialog/image-crop-dialog.component';
import { AddAchieverComponent } from './institute-achievers-listing/add-achiever/add-achiever.component';
import { InstituteAchieversListingComponent } from './institute-achievers-listing/institute-achievers-listing.component';
import { InstituteImageCropComponent } from './institute-image-crop/institute-image-crop.component';
import { CreateInstituteNotificationComponent } from './institute-notification/create-institute-notification/create-institute-notification.component';
import { InstituteNotificationComponent } from './institute-notification/institute-notification.component';
import { NotifiedInstitutesComponent } from './institute-notification/notified-institutes/notified-institutes.component';
import { MappingPageComponent } from './mapping-page/mapping-page.component';
import { OnBoardingPageComponent } from './on-boarding-page/on-boarding-page.component';
import { CalculateFreeSpacePipe } from './pipes/calculate-free-space.pipe';
import { ConvertSizeIntoReadableFormatPipe } from './pipes/convert-size-into-readable-format.pipe';
import { ExamClockPipe } from './pipes/exam-clock.pipe';
import { ShortPipe } from './pipes/short.pipe';
import { TablePaginatorPipe } from './pipes/table-paginator.pipe';
import { PlanDetailsComponent } from './plan-details/plan-details.component';
import { ProfileComponent } from './profile/profile.component';
import { PurchasedPlansComponent } from './purchased-plans/purchased-plans.component';
import { QuizSubmitByComponent } from './quiz-submit-by/quiz-submit-by.component';
import { StudentNotificationComponent } from './student-notification/student-notification.component';
import { SupportPageComponent } from './support-page/support-page.component';
import { TablePaginatorComponent } from './table-paginator/table-paginator.component';
import { TeacherNotificationComponent } from './teacher-notification/teacher-notification.component';
import { AdminListingComponent } from './user-listing/admin-listing/admin-listing.component';
import { StudentListingComponent } from './user-listing/student-listing/student-listing.component';
import { TeacherListingComponent } from './user-listing/teacher-listing/teacher-listing.component';
import { UserListingComponent } from './user-listing/user-listing.component';
import { UserTransactionHistoryComponent } from './user-transaction-history/user-transaction-history.component';
import { UserRazorpayDetailsComponent } from './user-razorpay-details/user-razorpay-details.component';
import { SafePipe } from './pipes/safe.pipe';
import { TempPlansComponent } from './temp-plans/temp-plans.component';
import { ClipboardModule } from 'ngx-clipboard';
import { BatchesComponent } from './batches/batches.component';
import { VideoPlayerComponent } from '../StandaloneComponents/video-player/video-player.component';
import { ReportsComponent } from './reports/reports.component';
import { GenerateReportComponent } from './reports/generate-report/generate-report.component';
import { ReportsListingComponent } from './reports/reports-listing/reports-listing.component';
import { CreateStudentTeacherNotificationComponent } from './student-teacher-notification/create-student-teacher-notification/create-student-teacher-notification.component';
import { StudentTeacherNotificationComponent } from './student-teacher-notification/student-teacher-notification.component';
import { NotifiedUsersComponent } from './student-teacher-notification/notified-users/notified-users.component';
import { ListingBannerComponent } from './listing-banner/listing-banner.component';
import { PrerecordedModulesComponent } from './prerecorded-modules/prerecorded-modules.component';
import { CreatePrerecordedModuleComponent } from './create-prerecorded-module/create-prerecorded-module.component';
import { CreatePrerecordedSectionsComponent } from './create-prerecorded-module/create-prerecorded-sections/create-prerecorded-sections.component';
import { PrerecordedMaterialListingComponent } from './create-prerecorded-module/prerecorded-material-listing/prerecorded-material-listing.component';
import { PrerecordedMaterialsComponent } from './create-prerecorded-module/create-prerecorded-sections/prerecorded-materials/prerecorded-materials.component';
import { BatchprerecordedmodulesComponent } from './batchprerecordedmodules/batchprerecordedmodules.component';
import { PrerecordedpreviewComponent } from './prerecordedpreview/prerecordedpreview.component';
import { CharacterLimitDirective } from '../directives/character-limit-directive.directive';
import { TruncatePipe } from './pipes/truncate.pipe';
import { MaterialPreviewComponent } from './file-management/material-preview/material-preview.component';
import { MaterialVideoPlayerComponent } from '../StandaloneComponents/material-video-player/material-video-player.component';
import { EditClassConfigurationComponent } from './class-configuration/edit-class-configuration/edit-class-configuration.component';
import { AddClassInConfigurationComponent } from './class-configuration/add-class-in-configuration/add-class-in-configuration.component';

@NgModule({
  declarations: [
    CommonComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LoaderComponent,
    InnerhtmltoplaintextPipe,
    FilterPipe,
    PaginationsComponent,
    PaginatePipe,
    ClassConfigurationComponent,
    CreateEditClassConfigurationComponent,
    ScheduleClassListComponent,
    BreadcrumbsComponent,
    DocumentPreviewComponent,
    CoursesComponent,
    CourseWizardComponent,
    AddEditCourseComponent,
    TablePaginatorPipe,
    TablePaginatorComponent,
    CoursePricingPlansComponent,
    AddEditPricingplanComponent,
    ProfileComponent,
    UserTransactionHistoryComponent,
    AddUserComponent,
    CourseBatchesComponent,
    UserListingComponent,
    AdminListingComponent,
    TeacherListingComponent,
    StudentListingComponent,
    AddEditBatchesComponent,
    AddTeacherComponent,
    AddEditInstituteComponent,
    MappingPageComponent,
    ClassMappingPageComponent,
    AssignmentDocumentPreviewComponent,
    FileManagementComponent,
    ImageCropDialogComponent,
    ConvertSizeIntoReadableFormatPipe,
    CalculateFreeSpacePipe,
    PreviewComponent,
    ExamClockPipe,
    QuizSubmitByComponent,
    InstituteImageCropComponent,
    BulkUserUploadComponent,
    EnrolledStudentsComponent,
    SupportPageComponent,
    OnBoardingPageComponent,
    ExplorePlansComponent,
    ErrorPageComponent,
    PlanDetailsComponent,
    ShortPipe,
    InstituteNotificationComponent,
    TeacherNotificationComponent,
    StudentNotificationComponent,
    CreateInstituteNotificationComponent,
    NotifiedInstitutesComponent,
    InstituteAchieversListingComponent,
    AddAchieverComponent,
    NotificationDetailsComponent,
    DisabledCoursesComponent,
    BlogListingComponent,
    AddEditBlogComponent,
    BlogImageCropperComponent,
    PurchasedPlansComponent,
    RequestForOtherCategoryComponent,
    SupportComponent,
    CoverImageCropComponent,
    CurrentPlanHistoryComponent,
    UserRazorpayDetailsComponent,
    SafePipe,
    TempPlansComponent,
    BatchesComponent,
    ReportsComponent,
    GenerateReportComponent,
    ReportsListingComponent,
    CreateStudentTeacherNotificationComponent,
    StudentTeacherNotificationComponent,
    NotifiedUsersComponent,
    ListingBannerComponent,
    PrerecordedModulesComponent,
    CreatePrerecordedModuleComponent,
    CreatePrerecordedSectionsComponent,
    PrerecordedMaterialListingComponent,
    PrerecordedMaterialsComponent,
    BatchprerecordedmodulesComponent,
    PrerecordedpreviewComponent,
    CharacterLimitDirective,
    TruncatePipe,
    MaterialPreviewComponent,
    EditClassConfigurationComponent,
    AddClassInConfigurationComponent
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    LoaderComponent,
    FooterComponent,
    InnerhtmltoplaintextPipe,
    FilterPipe,
    PaginationsComponent,
    BreadcrumbsComponent,
    AddUserComponent,
    ProfileComponent,
    UserListingComponent,
    AddEditInstituteComponent,
    TablePaginatorComponent,
    FileManagementComponent,
    ExamClockPipe,
    SupportPageComponent,
    OnBoardingPageComponent,
    ExplorePlansComponent,
    ErrorPageComponent,
    PlanDetailsComponent,
    ShortPipe,
    InstituteNotificationComponent,
    TeacherNotificationComponent,
    StudentNotificationComponent,
    UserRazorpayDetailsComponent,
    SafePipe,
    SupportComponent,
    TempPlansComponent,
    BatchesComponent,
    CreateStudentTeacherNotificationComponent,
    StudentTeacherNotificationComponent,
    NotifiedUsersComponent,
    ListingBannerComponent,
    PrerecordedModulesComponent,
    CreatePrerecordedModuleComponent,
    CreatePrerecordedSectionsComponent,
    PrerecordedMaterialListingComponent,
    PrerecordedMaterialsComponent,
    BatchprerecordedmodulesComponent,
    PrerecordedpreviewComponent,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    CommonRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatCommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule,
    PdfViewerModule,
    MatChipsModule,
    MatTabsModule,
    MatFormFieldModule,
    AngularEditorModule,
    MatSelectModule,
    MatInputModule,
    TagInputModule,
    ImageCropperModule,
    MatPaginatorModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    ClipboardModule,
    VideoPlayerComponent,
    MaterialVideoPlayerComponent
  ],
})
export class CommonModule2 {}
