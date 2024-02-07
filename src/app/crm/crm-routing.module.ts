import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFieldComponent } from './add-field/add-field.component';
import { AddLeadComponent } from './add-lead/add-lead.component';
import { BulkLeadsUploadComponent } from './bulk-leads-upload/bulk-leads-upload.component';
import { CrmComponent } from './crm.component';
import { EditLeadComponent } from './edit-lead/edit-lead.component';
import { FailedToConvertLeadsComponent } from './failed-to-convert-leads/failed-to-convert-leads.component';
import { FollowUpListingComponent } from './follow-up-listing/follow-up-listing.component';
import { InstituteAdminDashboardComponent } from './institute-admin-dashboard/institute-admin-dashboard.component';
import { LeadHistoryComponent } from './lead-history/lead-history.component';
import { LeadsListingComponent } from './leads-listing/leads-listing.component';

const routes: Routes = [
  {
    path: '',
    component: CrmComponent,
    children: [
      { path: 'dashboard', component: InstituteAdminDashboardComponent },
      { path: 'leads-listing', component: LeadsListingComponent },
      { path: 'addLead', component: AddLeadComponent },
      { path: 'editLead', component: EditLeadComponent },
      { path: 'addField', component: AddFieldComponent },
      {
        path: 'leadHistory',
        component: LeadHistoryComponent,
      },
      {
        path: 'incomplete-leads',
        component: FailedToConvertLeadsComponent,
      },
      {
        path:'leads-csv-upload',
        component:BulkLeadsUploadComponent
      },
      {
        path:'follow-up-listing',
        component:FollowUpListingComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrmRoutingModule {}
