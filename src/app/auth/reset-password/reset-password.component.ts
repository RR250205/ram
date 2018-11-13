import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
    AfterViewInit,
    ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response, Headers } from "@angular/http";
import "rxjs/add/operator/map";

import { ScriptLoaderService } from '../../_services/script-loader.service';
import { UrlHandlerService } from '../../_services/url-handler.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import { AlertComponent } from '../_directives/alert.component';
import { LoginCustom } from '../_helpers/login-custom';
import { Helpers } from '../../helpers';
declare var toastr: any;

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    model: any = {};
    token: String;
    loading = false;

    @ViewChild('alertSignup',
        { read: ViewContainerRef }) alertSignup: ViewContainerRef;
    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    constructor(
        private _router: Router,
        private _http: Http,
        private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
    }
    ngOnInit() {
        // this.token = this._route.snapshot.params['token'];
        // let headers = new Headers();
        // let token = this._route.snapshot.params['token'];

        // localStorage.setItem('resetToken', token);
        // let reset_token = localStorage.getItem('resetToken');
        // console.log('Local Storage Token: ' + reset_token);
    }
    resetPassword(model: any) {
        let headers = new Headers();
        let password = model.value.password;
        let confirmpassword = model.value.confirmpassword;
        let reset_token = localStorage.getItem('resetToken');
        headers.append('Content-Type', 'application/json');
        Helpers.setLoading(true);
        return this._http.post(this._root.root_url + '/passwords/' + reset_token + '/resetconfirmation', { password: password }, { headers: headers })
            .subscribe((res) => {
                Helpers.setLoading(false);
                let data = res.json();
                toastr.success(data.message);
                this._router.navigate(['/login']);
                localStorage.removeItem('resetToken');
            },
            error => {
                let err = error.json()
                toastr.warning(err.message);
                Helpers.setLoading(false);
            });
    }
    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
        Helpers.setLoading(false);
    }

}
