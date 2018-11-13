import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../auth/_services/alert.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Subject } from 'rxjs/Subject';


@Component({
    selector: "app-testing",
    templateUrl: "./testing.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TestingComponent implements OnInit {
    constructor(private _script: ScriptLoaderService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _http: Http,
        private _alertService: AlertService,
        private elRef: ElementRef) {
    }
    ngOnInit() {

    }

    ngAfterViewInit() {
        this._script.loadScripts('app-testing',
            ['assets/demo/default/custom/components/datatables/base/data-local.js']);
    }
}
