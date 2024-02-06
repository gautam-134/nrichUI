import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignRoleGuard } from '../guards/assign-role.guard';
import { LoginGuard } from '../guards/login.guard';
import { StudentProfileGuard } from '../guards/student-profile.guard';
import { NewLoginComponent } from './login/new-login/new-login.component';
import { NewSignupCheckComponent } from './signup/new-signup-check/new-signup-check.component';
import { SignUpProfileComponent } from './signup/sign-up-profile/sign-up-profile.component';

const routes: Routes = [
  {
    path: 'login',
    component: NewLoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'login/:code',
    component: NewLoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'role',
    component: NewSignupCheckComponent,
    canActivate: [AssignRoleGuard],
    canDeactivate: [AssignRoleGuard],
  },
  {
    path: 'role/:code',
    component: NewSignupCheckComponent,
    canActivate: [AssignRoleGuard],
    canDeactivate: [AssignRoleGuard],
  },
  {
    path: 'profile/:type',
    component: SignUpProfileComponent,
    canActivate: [StudentProfileGuard],
    canDeactivate: [StudentProfileGuard],
  },
  {
    path: 'profile/:type/:code',
    component: SignUpProfileComponent,
    canActivate: [StudentProfileGuard],
    canDeactivate: [StudentProfileGuard],
  },

  // {
  //   path: 'signup',
  //   component: SignupComponent,
  // },
  // {
  //   path: 'otp',
  //   component: OtpComponent,
  // },
  // {
  //   path: 'login-otp',
  //   component: LoginOtpComponent,
  //   canActivate: [LoginGuard],
  // },
  // { path: 'signup-role', component: SignupCheckComponent },
  // { path: 'forgot-password', component: ForgotPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
