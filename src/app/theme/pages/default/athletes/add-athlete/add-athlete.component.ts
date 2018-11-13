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
import { Observable } from 'rxjs/Observable';

import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UrlHandlerService } from '../../../../../_services/url-handler.service';
import { UserService, AuthenticationService, AlertService } from '../../../../../auth/_services';
import { first } from 'rxjs/operator/first';
import { Athlete } from '../../activities/add-activity/models/athlete';
declare let swal: any;


@Component({
    selector: 'app-add-athlete',
    templateUrl: './add-athlete.component.html',
    styleUrls: ['./add-athlete.component.css']
})
export class AddAthleteComponent implements OnInit, AfterViewInit {
    sports: any[] = [];
    Athlete = new Athlete();

    model: any = {};
    loading = false;
    public imgID: any;
    public imageChangedEvent: any = '';
    public croppedImage: any = '';
    public baseImage: any = '';
    public imgUrl: any;
    addAthelteProfile: any;
    preferredUnitID: any = localStorage.getItem('preferedUnit');

    errors: Array<string> = [];
    dragAreaClass: string = 'dragarea';
    @Input() projectId: number = 0;
    @Input() sectionId: number = 0;
    @Input() fileExt: string = "JPG, GIF, PNG";
    @Input() maxFiles: number = 5;
    @Input() maxSize: number = 5; // 5MB
    @Output() uploadStatus = new EventEmitter();

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
        this.getSports();
    }
    ngOnInit() {
    }
    ngAfterViewInit() {
        this._script.loadScripts('app-add-athlete',
            ['assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js']);
        this._script.loadScripts('app-add-athlete',
            ['assets/demo/default/custom/components/forms/widgets/bootstrap-switch.js']);
        this._script.load('app-add-athlete',
            'assets/demo/default/custom/components/forms/validation/form-controls.js');
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(image: string) {
        this.croppedImage = image;

    }
    public imageCropping() {
        let imageData1 = this.croppedImage;
        let formData = new FormData();
        let parsedJSON;
        formData.append('imageData', imageData1);
        let forms = formData;
        this.profpictureService.uploadImage(formData)
            .subscribe(res => {
                console.log("Image" + res);
            },
            err => {
                console.log("image not uploaded");
            });
    }
    cancelAthlete() {
        this._router.navigate(['/athlete-management']);
    }
    getSports() {
        let _self = this;
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        return _self._http.get(this._root.root_url + '/sports', { headers: headers })
            .subscribe((res: Response) => {
                let listSports = res.json();
                listSports.forEach(element => {
                    let name = element.sport_name;
                    let id = element.id;
                    this.sports.push({
                        id: id,
                        name: name
                    });
                });
            });
    }
    addAthlete(addAthleteform) {
        if (addAthleteform.form.valid) {
      
            let athlete = this.Athlete;
            if(this.Athlete.first_name!=null){
            this.Athlete.first_name = this.Athlete.first_name[0].toUpperCase() + this.Athlete.first_name.slice(1);
            }
            if(this.Athlete.last_name!=null){
            this.Athlete.last_name = this.Athlete.last_name[0].toUpperCase() + this.Athlete.last_name.slice(1);
            }
            if (this.croppedImage != "") {
                athlete.profile_picture = this.croppedImage;
            } else {

                athlete.profile_picture = "data:image/jpeg;base64,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";
            }
            let selectYear=new Date(this.Athlete.date_of_birth).getFullYear();
            let currentYear = new Date().getFullYear();
            let difference=currentYear - selectYear;
            if(difference <= 4){
                swal('Date of birth is not valid year!');
            }else{
            let athletes = { athlete };
            let headers = new Headers();
            let currentUser = localStorage.getItem('currentUser');
            headers.append('Authorization', 'Bearer ' + currentUser);
            headers.append('Content-Type', 'application/json');
            return this._http.post(this._root.root_url + '/athletes', athletes, { headers: headers })
                .subscribe((res) => {
                    console.log(res);
                    this._router.navigate(['/athlete-management']);
                });
        }
    }
    }

    

    // validateDOB(e){
    //     let year = new Date(e.model).getFullYear();
    //     let currentYear = new Date().getFullYear();
    //     let difference=currentYear - year;
    //     if(difference <= 4){
    //         setTimeout(() => {
    //         swal('Date of birth is not valid year!');
    //         this.Athlete.date_of_birth=null;
    //     }, 1000);
    //     }}
}
