import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UrlHandlerService } from '../../../../../_services/url-handler.service';
import { ToastrService } from '../../../../../_services/toastr.service';
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
declare var toastr: any;

@Component({
    selector: "app-invite-user",
    templateUrl: "./inviteuser.component.html",
    encapsulation: ViewEncapsulation.None,
})
@NgModule({
    imports: [
        FormsModule
    ],
})

export class InviteuserComponent implements OnInit {
    model: any = {};


    constructor(private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _toastr: ToastrService,
        private _http: Http,
        private _alertService: AlertService) {
    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/components/base/toastr.js');
        this._script.load('app-invite-user',
            'assets/demo/default/custom/components/forms/validation/form-controls.js');
    }
    inviteuser(i) {
        console.log(i);
        if (i.form.valid) {
            let email = this.model.email;
            let currentUser = localStorage.getItem('currentUser');
            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + currentUser);
            headers.append('Content-Type', 'application/json');
            let user = { email };
            Helpers.setLoading(true);
            return this._http.post(this._root.root_url + '/users/invite', user, { headers: headers })
                .subscribe(result => {
                    let msg = result.json();
                    if (msg != null) {
                        toastr.success(msg.message, 'Send Mail');
                        this._router.navigate(['/user-management']);
                        Helpers.setLoading(false);
                    }
                    else {
                        toastr.error("Sorry the mail didn't send. Check with your System Admin.", 'Send Mail');
                        Helpers.setLoading(false);
                    }
                },

                error => {
                    Helpers.setLoading(false);
                });
        }
    }

}
