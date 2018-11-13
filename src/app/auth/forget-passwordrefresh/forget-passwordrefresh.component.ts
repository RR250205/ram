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

@Component({
    selector: 'app-forgetrefresh-password',
    templateUrl: './forget-passwordrefresh.component.html'
    // styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordRefreshComponent implements OnInit {

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
        console.log('hi')

        // this.token = this._route.snapshot.params['token'];
        // let headers = new Headers();
        // let token = this._route.snapshot.params['token'];


        // console.log('Local Storage Token: ' + reset_token);
        this._route.params.subscribe(params => {
            let forgetPassword = params;
            localStorage.setItem('resetToken', forgetPassword.token);
            let reset_token = localStorage.getItem('resetToken');
            console.log(reset_token);
            setTimeout(() => {
                this._router.navigate(['/resetPassword']);
            }, 100);

        });


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





}
