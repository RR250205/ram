import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UrlHandlerService } from '../../../../../_services/url-handler.service';
import { ToastrService } from '../../../../../_services/toastr.service';

import "rxjs/add/operator/map";

@Component({
    selector: "app-sport",
    templateUrl: "./add-sport.component.html",
    encapsulation: ViewEncapsulation.None,
})
@NgModule({
    imports: [
        FormsModule
    ],
})

export class AddSportComponent implements OnInit {
    model: any = {};

    constructor(private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService,
        private _http: Http,
        private _alertService: AlertService) {
    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/components/base/toastr.js');
    }
    addSport(form: any) {
        console.log(form);
        let _self = this;
        this.model.sport_name = form.sport;
        this.model.desc = form.desc;
        let sport_name = this.model.sport_name;
        let description = this.model.desc;
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        let sport = { sport_name, description };
        return this._http.post(this._root.root_url + '/sports', { sport }, { headers: headers })
            .subscribe(result => {
                if (result) {
                    _self._toastrService.Success('Sport ' + this.model.sport_name + ' Has Been Added Successfully', 'Add Sport');
                    this._router.navigate(['/sport-management']);
                }
                else {
                    this._router.navigate(['/logout']);
                }
            },
            error => {
                this._alertService.error(error);
            });
    }

}
