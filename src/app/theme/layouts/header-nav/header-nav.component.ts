import { Component, OnInit, ViewEncapsulation, NgModule, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../auth/_services/alert.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from '../../../helpers';
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    styleUrls: ['./header-nav.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {
    userRole = localStorage.getItem('userRole');

    constructor(private _script: ScriptLoaderService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _http: Http,
        private _alertService: AlertService) {
        this.userRole = localStorage.getItem('userRole');
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        mLayout.initHeader();
    }
    onAthlete() {
        this._router.navigate(['/refresh-athlete-management']);
    }
    onUser() {
        this._router.navigate(['/refresh-user-management']);
    }
    onSport() {
        this._router.navigate(['/refresh-sport-management']);
    }
    onActivity() {
        this._router.navigate(['/refresh-activity-management']);
    }
    onReport() {
        this._router.navigate(['/refresh-report-management']);
    }
}