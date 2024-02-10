import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './common/error-page/error-page.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ModuleGuardGuard } from './guards/module-guard.guard';
import { PlanExpiryGuard } from './guards/plan-expiry.guard';
import { PlanExpiryComponent } from './plan-expiry/plan-expiry.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
          import('./marketing/marketing.module').then((m) => m.MarketingModule),
      },
      {
        path: 'error',
        component: ErrorPageComponent,
      },
      {
        path: 'settings',
        canLoad: [ModuleGuardGuard],
        component: SettingsComponent,
      },
      {
        path: 'emailVerification',
        component: EmailVerificationComponent,
      },
      // {
      //   path: 'social-connect',
      //   // canLoad: [LoginGuard],
      //   loadChildren: () =>
      //     import('./social-connect/social-connect.module').then(
      //       (m) => m.SocialConnectModule
      //     ),
      // },
      {
        path: 'teacher',
        canLoad: [PlanExpiryGuard, ModuleGuardGuard],
        loadChildren: () =>
          import('./teacher/teacher.module').then((m) => m.TeacherModule),
        data: { id: 3 },
      },
      // {
      //   path: 'marketing',
      //   loadChildren: () =>
      //     import('./marketing/marketing.module').then((m) => m.MarketingModule),
      // },
      {
        path: '',
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'student',
        canLoad: [PlanExpiryGuard, ModuleGuardGuard],
        loadChildren: () =>
          import('./student/student.module').then((m) => m.StudentModule),
        data: { id: 2 },
      },
      {
        path: 'master',
        // canLoad: [LoginGuard],
        loadChildren: () =>
          import('./subscription/subscription.module').then(
            (m) => m.SubscriptionModule
          ),
        canLoad: [ModuleGuardGuard],
        data: { id: 4 },
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
        canLoad: [PlanExpiryGuard, ModuleGuardGuard],
        data: { id: 1 },
      },
      {
        path: 'planExpired',
        component: PlanExpiryComponent,
      },
      { path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule) },
      {
        path: '**',
        redirectTo: '/', // Redirect to your home page
      },
    ];
    const routerOptions: ExtraOptions = {
      scrollPositionRestoration: 'enabled',
      // anchorScrolling: 'enabled',
    };
    @NgModule({
      imports: [RouterModule.forRoot(routes, routerOptions)],
    
      exports: [RouterModule],
    })
    export class AppRoutingModule {}
    