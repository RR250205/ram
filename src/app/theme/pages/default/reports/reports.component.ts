import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../auth/_services/alert.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { UrlHandlerService } from '../../../../_services/url-handler.service';
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

@Component({
    selector: "app-reports",
    templateUrl: "./reports.component.html",
    styleUrls: ['./reports.component.css'],
    encapsulation: ViewEncapsulation.None,
})
@NgModule({
    imports: [
        FormsModule
    ],
})

export class ReportsComponent implements OnInit {

    constructor(private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _http: Http,
        private _alertService: AlertService) {
    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/components/base/toastr.js');
    }
}