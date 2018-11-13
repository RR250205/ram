import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from "./auth/logout/logout.component";
import { EmailVerifyComponent } from './auth/email-verify/email-verify.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ForgetPasswordRefreshComponent } from './auth/forget-passwordrefresh/forget-passwordrefresh.component';

const routes: Routes = [

    { path: 'login', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'signup', component: SignupComponent },
    { path: 'logout', component: LogoutComponent },
    {
        path: 'resetPassword',
        component: ResetPasswordComponent
    },
    // passwords/:token/forget
    {
        path: 'forgetPassword',
        component: ForgetPasswordComponent
    },
    {
        path: 'passwords/:token/reset',
        component: ForgetPasswordRefreshComponent
    },
    {
        path: 'users/:token/signup',
        component: EmailVerifyComponent
    },
    { path: '', redirectTo: 'index', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }