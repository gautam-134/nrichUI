import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrmRoutingModule } from './crm-routing.module';
import { CrmComponent } from './crm.component';
import { CommonModule2 } from '../common/common.module';
import { LeadsListingComponent } from './leads-listing/leads-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignLeadComponent } from './assign-lead/assign-lead.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddLeadComponent } from './add-lead/add-lead.component';
import { EditLeadComponent } from './edit-lead/edit-lead.component';
import { AddFieldComponent } from './add-field/add-field.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { InstituteAdminDashboardComponent } from './institute-admin-dashboard/institute-admin-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeadHistoryComponent } from './lead-history/lead-history.component';
import { FailedToConvertLeadsComponent } from './failed-to-convert-leads/failed-to-convert-leads.component';
import { BulkLeadsUploadComponent } from './bulk-leads-upload/bulk-leads-upload.component';
import { FollowUpListingComponent } from './follow-up-listing/follow-up-listing.component';
import { FacebookLeadsComponent } from './facebook-leads/facebook-leads.component';
import { FacebookLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  declarations: [
    CrmComponent,
    LeadsListingComponent,
    AssignLeadComponent,
    AddLeadComponent,
    EditLeadComponent,
    AddFieldComponent,
    InstituteAdminDashboardComponent,
    LeadHistoryComponent,
    FailedToConvertLeadsComponent,
    BulkLeadsUploadComponent,
    FollowUpListingComponent,
    FacebookLeadsComponent,
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    CommonModule2,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgApexchartsModule,
    SocialLoginModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("580093826845087")
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig
    }
  ],
})
export class CrmModule {}
