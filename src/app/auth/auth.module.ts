import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { AuthRoutingModule } from './auth-routing.routing';
import { AuthComponent } from './auth.component';
import { AlertComponent } from './_directives/alert.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './_guards/auth.guard';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';
import { fakeBackendProvider } from './_helpers/index';
import { EmailVerifyComponent } from './email-verify/email-verify.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ForgetPasswordRefreshComponent } from './forget-passwordrefresh/forget-passwordrefresh.component';
import { CookieService } from 'ngx-cookie-service';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    declarations: [
        AuthComponent,
        AlertComponent,
        LogoutComponent,
        EmailVerifyComponent,
        SignupComponent,
        ResetPasswordComponent,
        ForgetPasswordRefreshComponent,
        ForgetPasswordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        AuthRoutingModule,
        ReactiveFormsModule
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        // api backend simulation
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions,
        CookieService
    ],
    entryComponents: [AlertComponent],
})

export class AuthModule {
}