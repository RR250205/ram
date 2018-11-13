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
import { ToastrService } from '../../../../../_services/toastr.service';
import { UserService, AuthenticationService, AlertService } from '../../../../../auth/_services';
import { first } from 'rxjs/operator/first';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-edit-sport',
    templateUrl: './edit-sport.component.html',
    styles: ['']
})
export class EditSportComponent implements OnInit, AfterViewInit {

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
        private _toastrService: ToastrService,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {

        this.id = this._route.snapshot.params['id'];
        this.getSport();
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this._script.load('app-edit-sport',
            'assets/demo/default/custom/components/base/toastr.js');
    }


    getSport() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._root.root_url + '/sports/' + this.id + '/edit', { headers: headers })
            .subscribe((res) => {
                let currentSport = res.json();
                console.log(currentSport.id);
                this.model.sport_name = currentSport.sport.sport_name;
                this.model.description = currentSport.sport.description;
            });
    }
    editSport(model: any) {
        let sport_name = model.value.sport_name;
        let description = model.value.description;
        let sport = { sport_name, description };
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        return this._http.put(this._root.root_url + '/sports/' + this.id, sport, { headers: headers })
            .subscribe((res) => {
                this._router.navigate(['/sport-management']);
                this._toastrService.Info("Sport has been edited", "Edit Sport");
            });
    }
}
