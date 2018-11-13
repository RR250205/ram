import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";

@Component({
    selector: "app-refresh-sport",
    templateUrl: "./refresh-sport.component.html",
    encapsulation: ViewEncapsulation.None,
})
@NgModule({
    imports: [
        FormsModule
    ],
})

export class RefreshSportComponent implements OnInit {
    constructor(private _script: ScriptLoaderService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _http: Http,
        private _alertService: AlertService) {
    }
    ngOnInit() {
        this._router.navigate(['/sport-management']);
    }
}
