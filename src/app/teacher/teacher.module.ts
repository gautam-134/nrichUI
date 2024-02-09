import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule2 } from '../common/common.module';
import { AddAssignmentComponent } from './assignment/add-assignment/add-assignment.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { LiveClassComponent } from './live-class/live-class.component';
import { AddMaterialComponent } from './material-listing/add-material/add-material.component';
import { MaterialListingComponent } from './material-listing/material-listing.component';
import { AllClassComponent } from './teacher-dashboard/all-material/all-class/all-class.component';
import { AllMaterialComponent } from './teacher-dashboard/all-material/all-material.component';
import { AssigmentComponent } from './teacher-dashboard/all-material/assigment/assigment.component';
import { MaterialsComponent } from './teacher-dashboard/all-material/materials/materials.component';
import { ViewDocComponent } from './teacher-dashboard/all-material/materials/view-doc/view-doc.component';
import { QuizComponent } from './teacher-dashboard/all-material/quiz/quiz.component';
import { ReviewComponent } from './teacher-dashboard/all-material/review/review.component';
import { SubjectComponent } from './teacher-dashboard/all-material/subject/subject.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherComponent } from './teacher.component';

import { NgxFileDropModule } from 'ngx-file-drop';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CourseRequestComponent } from './course-request/course-request.component';
import { QuizCreationComponent } from './quiz-creation/quiz-creation.component';
import { QuizQuestionPreviewComponent } from './quiz-creation/quiz-question-preview/quiz-question-preview.component';
import { QuizQuestionComponent } from './quiz-creation/quiz-question/quiz-question.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TagInputModule } from 'ngx-chips';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DisableControlsDirective } from '../directives/disable-controls.directive';
import { DemoClassesComponent } from '../student/student-enrollment/student-dashboard-info/demo-classes/demo-classes.component';
import { AssignmentSudmitbyComponent } from './assignment/assignment-sudmitby/assignment-sudmitby.component';
import { EvaluateAssignmentComponent } from './assignment/assignment-sudmitby/evaluate-assignment/evaluate-assignment.component';
import { CreateCourseRequestComponent } from './create-course-request/create-course-request.component';
import { DemoStudentRequestComponent } from './demo-student-request/demo-student-request.component';
import { MaterialClassMappingComponent } from './material-listing/material-class-mapping/material-class-mapping.component';
import { QuizCropperComponent } from './quiz-creation/quiz-cropper/quiz-cropper.component';
import { QuizPreviewComponent } from './quiz-creation/quiz-preview/quiz-preview.component';
import { TeacherDashboardAnaylticsComponent } from './teacher-dashboard-anayltics/teacher-dashboard-anayltics.component';
import { ClassDetailsComponent } from './teacher-dashboard/all-material/class-details/class-details.component';
import { TeacherDemoClassesComponent } from './teacher-dashboard/all-material/teacher-demo-classes/teacher-demo-classes.component';
import { TeacherWebinarsComponent } from './teacher-dashboard/all-material/teacher-webinars/teacher-webinars.component';
import { VideoPlayerComponent } from "../StandaloneComponents/video-player/video-player.component";

@NgModule({
    declarations: [
        TeacherComponent,
        TeacherDashboardComponent,
        LiveClassComponent,
        AllMaterialComponent,
        AllClassComponent,
        AssigmentComponent,
        MaterialsComponent,
        QuizComponent,
        ReviewComponent,
        SubjectComponent,
        ViewDocComponent,
        AssignmentComponent,
        AddAssignmentComponent,
        MaterialListingComponent,
        AddMaterialComponent,
        CourseRequestComponent,
        QuizListComponent,
        QuizQuestionComponent,
        QuizQuestionPreviewComponent,
        QuizCreationComponent,
        MaterialClassMappingComponent,
        AssignmentSudmitbyComponent,
        CreateCourseRequestComponent,
        DemoStudentRequestComponent,
        ClassDetailsComponent,
        EvaluateAssignmentComponent,
        DemoClassesComponent,
        TeacherDemoClassesComponent,
        QuizPreviewComponent,
        TeacherWebinarsComponent,
        QuizCropperComponent,
        TeacherDashboardAnaylticsComponent,
        DisableControlsDirective,
    ],
    imports: [
        CommonModule,
        TeacherRoutingModule,
        CommonModule2,
        MatTabsModule,
        PdfViewerModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatIconModule,
        AngularEditorModule,
        MatMenuModule,
        MatPaginatorModule,
        FormsModule,
        NgxFileDropModule,
        DragDropModule,
        MatInputModule,
        MatSnackBarModule,
        TagInputModule,
        NgxDocViewerModule,
        ImageCropperModule,
        NgApexchartsModule,
        MatProgressBarModule,
        VideoPlayerComponent
    ]
})
export class TeacherModule {}
