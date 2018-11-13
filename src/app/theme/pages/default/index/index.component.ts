import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    ElementRef,
    OnDestroy,
    ComponentFactoryResolver,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {
    ActivatedRoute,
    Router
} from "@angular/router";
import { AlertService } from '../../../../auth/_services/alert.service';
import {
    Headers,
    Http,
    RequestOptions,
    Response
} from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Subject } from 'rxjs/Subject';
import { UrlHandlerService } from '../../../../_services/url-handler.service';
import {
    UserService,
    AuthenticationService
} from '../../../../auth/_services';

@Component({
    selector: "app-index",
    templateUrl: "./index.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class IndexComponent implements OnInit, AfterViewInit {
    no_of_users: any;
    no_of_activities: any;
    no_of_athletes: any;
    userRole: any;
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
        this.getListAthletes();
        this.getListActivities();
        this.getListUsers();
        this.userRole = localStorage.getItem("userRole");
        console.log("User Role: " + this.userRole);
    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.loadScripts('app-index',
            ['assets/app/js/dashboard.js']);
    }
    listUsers() {
        this._router.navigate(['/user-management']);
    }
    listAthletes() {
        this._router.navigate(['/athlete-management']);
    }
    listActivities() {
        this._router.navigate(['/activity-management']);
    }
    public getListActivities() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._root.root_url + '/activities', { headers: headers })
            .subscribe(res => {
                let listofActivities = res.json().length;
                this.no_of_activities = listofActivities;
            });
    }
    getListUsers() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._root.root_url + '/users', { headers: headers })
            .subscribe(res => {
                let listofUsers = res.json().length;
                this.no_of_users = listofUsers;
            });
    }
    public getListAthletes() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._root.root_url + '/athletes', { headers: headers })
            .subscribe(res => {
                let listofAthletes = res.json().length;
                this.no_of_athletes = listofAthletes;
            });
    }
}