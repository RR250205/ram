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
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

    model: any = {};
    token: String;
    loading = false;

    constructor(
        private _router: Router,
        private _http: Http,
        private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
    }
    ngOnInit() {
        this.token = this._route.snapshot.params['token'];
        let headers = new Headers();
        let token = this._route.snapshot.params['token'];

        localStorage.setItem('resetToken', token);
        let reset_token = localStorage.getItem('resetToken');
        console.log('Local Storage Token: ' + reset_token);


    }

    // forgetPassword(model: any) {
    //     let headers = new Headers();
    //     let password = model.value.password;
    //     let confirmpassword = model.value.confirmpassword;
    //     let reset_token = localStorage.getItem('resetToken');
    //     headers.append('Content-Type', 'application/json');
    //     return this._http.post(this._root.root_url + '/passwords/' + reset_token + '/resetconfirmation', { password: password }, { headers: headers })
    //         .subscribe((res) => {
    //             console.log(res);
    //             this._router.navigate(['/login']);
    //             localStorage.removeItem('resetToken');
    //         });
    // }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    forgetPassword(forgetpassword) {

        if (forgetpassword.form.valid) {
            let email = this.model.email;;
            let currentUser = localStorage.getItem('currentUser');
            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + currentUser);
            headers.append('Content-Type', 'application/json');
            // let user = { email };
            Helpers.setLoading(true);
            return this._http.post(this._root.root_url + '/passwords/forgot', { email }, { headers: headers })
                .subscribe(result => {
                    Helpers.setLoading(false);
                    let data = result.json();
                    if (data.message != null) {
                        Helpers.setLoading(false);
                        toastr.success(data.message);
                        this._router.navigate(['/login']);
                    }
                },
                error => {
                    Helpers.setLoading(false);
                    let err = error.json()
                    toastr.warning(err.message);
                    this._router.navigate(['/login']);
                });
        }
    }

}
