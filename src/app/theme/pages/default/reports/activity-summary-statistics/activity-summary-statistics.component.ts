import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
    AfterViewInit,
    ElementRef,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import { ProfpictureService } from '../../../../../_services/profpicture.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UrlHandlerService } from '../../../../../_services/url-handler.service';
import { UserService, AuthenticationService, AlertService } from '../../../../../auth/_services';
import { first } from 'rxjs/operator/first';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-activity-summary-statistics',
    templateUrl: './activity-summary-statistics.component.html',
    styles: ['']
})
export class ActivitySummaryStatisticsComponent implements OnInit, AfterViewInit {

    model: any = {
        sport_name: String,
        description: String
    };
    loading = false;
    id: any;


    constructor(private _router: Router,
        private _http: Http,
        private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private profpictureService: ProfpictureService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {



    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this._script.load('app-edit-sport',
            'assets/demo/default/custom/components/base/toastr.js');
    }



}
