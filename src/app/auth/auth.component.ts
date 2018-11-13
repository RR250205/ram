import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptLoaderService } from '../_services/script-loader.service';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { AlertComponent } from './_directives/alert.component';
import { LoginCustom } from './_helpers/login-custom';
import { Helpers } from '../helpers';
import { CookieService } from 'ngx-cookie-service';
import { HighlightDirective } from '../theme/pages/default/activities/add-activity/directives/highlight.directive';

@Component({
    selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
    templateUrl: './templates/login-1.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AuthComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    rememberme: any;
    cookieValue = 'UNKNOWN';
    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    @ViewChild('alertSignup',
        { read: ViewContainerRef }) alertSignup: ViewContainerRef;
    @ViewChild('alertForgotPass',
        { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

    constructor(
        private _router: Router,
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver,
        private cookieService: CookieService,
    ) {
        if (this.cookieService.get('rememberme') == 'false') {
            this.model.email = null;
            this.model.password = null;
            this.model.rememberme = false;
        } else {
            this.model.email = this.cookieService.get('email');
            this.model.password = this.cookieService.get('password');
            this.model.rememberme = this.cookieService.get('rememberme');
        }
    }

    ngOnInit() {
        //     this.cookieService.set( 'Test', 'Hello World' );
        // this.cookieValue = this.cookieService.get('Test');
        // this.model.remember = true;
        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        this._router.navigate([this.returnUrl]);

        this._script.loadScripts('body', [
            'assets/vendors/base/vendors.bundle.js',
            'assets/demo/default/base/scripts.bundle.js'], true).then(() => {
                Helpers.setLoading(false);
                LoginCustom.init();
            });
    }


    signin() {
        let sessionUser;
        this.loading = true;
        console.log("This is Signin");
        this._authService.login(this.model.email, this.model.password)
            .subscribe(result => {
                console.log(result);
                if (result) {
                    this.cookieService.set('email', this.model.email);
                    this.cookieService.set('password', this.model.password);
                    this.cookieService.set('rememberme', this.model.rememberme);


                    this._router.navigate([this.returnUrl]);

                }
            },
            error => {
                this.showAlert('alertSignin');
                this._alertService.error(error);
                this.loading = false;
            });
    }


    forgotPass() {
        this.loading = true;
        this._userService.forgotPassword(this.model.email).subscribe(
            data => {
                this.showAlert('alertSignin');
                this._alertService.success(
                    'Cool! Password recovery instruction has been sent to your email.',
                    true);
                this.loading = false;
                LoginCustom.displaySignInForm();
                this.model = {};
            },
            error => {
                this.showAlert('alertForgotPass');
                this._alertService.error(error);
                this.loading = false;
            });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }
}