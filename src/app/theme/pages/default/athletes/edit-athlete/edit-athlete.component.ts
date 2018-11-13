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
import { Athlete } from '../../activities/add-activity/models/athlete';
import { json } from 'd3';
declare let swal: any;


@Component({
    selector: 'app-edit-athlete',
    templateUrl: './edit-athlete.component.html',
    styleUrls: ['./edit-athlete.component.css']
})
export class EditAthleteComponent implements OnInit, AfterViewInit {
    sports: any[] = [];
    Athlete = new Athlete();

    // model: any = {
    //     firstname: String,
    //     lastname: String,
    //     gender: Number,
    //     date_of_birth: String,
    //     height: String,
    //     email: String,
    //     level_of_athlete: String,
    //     address: String,
    //     sport_id: Number,
    //     unit_id: Number,
    //     is_team_nl: Number
    // };
    loading = false;
    id: any;

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

        this.id = this._route.snapshot.params['id'];
        this.getAthlete();
        // this.model.firstname = "";
        // this.model.lastname = "";
        // this.model.email = "";
        // this.model.sport_id = "1";
        // this.model.gender = "1";
        // this.model.is_team_nl = "1";
        // this.model.height = "";
        // this.model.unit_id= "";
        // this.model.level_of_athlete = "";

        this.getSports();
    }
    ngOnInit() {
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-edit-athlete',
            ['assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js']);
        this._script.load('app-edit-athlete',
            'assets/demo/default/custom/components/base/toastr.js');
            this._script.load('app-edit-athlete',
            'assets/demo/default/custom/components/forms/validation/form-controls.js');
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(image: string) {
        this.croppedImage = image;
        console.log(this.croppedImage);
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
    getAthlete() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._root.root_url + '/athletes/' + this.id, { headers: headers })
            .subscribe((res) => {

                console.log(res.json());
                let a = res.json();
                this.Athlete = a.athlete;
                if (this.Athlete.gender == 1) {
                    this.Athlete.gender = 1;
                } else {
                    this.Athlete.gender = 2;
                }

                // let currentAthlete = res.json();
                // this.model.firstname = currentAthlete.athlete.first_name;
                // this.model.lastname = currentAthlete.athlete.last_name;
                // this.model.email = currentAthlete.athlete.email;
                // this.model.gender = currentAthlete.athlete.gender;
                // if (currentAthlete.athlete.gender == "male") {
                //     this.model.gender = "1"
                // }
                // else {
                //     this.model.gender = "2"
                // }
                // this.model.date_of_birth = currentAthlete.athlete.date_of_birth;
                // this.model.height = currentAthlete.athlete.height;
                // this.model.is_team_nl = currentAthlete.athlete.is_team_nl;
                // if (currentAthlete.athlete.is_team_nl == false) {
                //     this.model.is_team_nl = "2";
                // }
                // else if (currentAthlete.athlete.is_team_nl == true) {
                //     this.model.is_team_nl = "1";
                // }
                // this.model.address = currentAthlete.athlete.address;
                // this.model.sport_id = currentAthlete.athlete.sport_id;
                // if (currentAthlete.athlete.unit_id == 2) {
                //     this.model.unit_id = "2";
                // }
                // else if (currentAthlete.athlete.unit_id == 1) {
                //     this.model.unit_id = "1";
                // }
                // if (currentAthlete.athlete.level_of_athlete == null) {
                //     this.model.level_of_athlete = "1";
                // }

            });
    }

    editAthlete(editAthleteform) {
        if (editAthleteform.form.valid) {
this.Athlete;
if(this.Athlete.first_name!=null){
    this.Athlete.first_name = this.Athlete.first_name[0].toUpperCase() + this.Athlete.first_name.slice(1);
    }
    if(this.Athlete.last_name!=null){
    this.Athlete.last_name = this.Athlete.last_name[0].toUpperCase() + this.Athlete.last_name.slice(1);
    }
        if (this.croppedImage != "") {
            this.Athlete.profile_picture = this.croppedImage;
        }

            let selectYear=new Date(this.Athlete.date_of_birth).getFullYear();
            let currentYear = new Date().getFullYear();
            let difference=currentYear - selectYear;
            if(difference <= 4){
                swal('Date of birth is not valid year!');
            }else{
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        return this._http.put(this._root.root_url + '/athletes/' + this.id, this.Athlete, { headers: headers })
            .subscribe((res) => {
                let dataAthleteCaps=res.json();
                this._router.navigate(['/athlete-management']);
            });
        }
    }
}

    // validateEditDOB(){
    //     // let year = new Date(e).getFullYear();
    //     let selectYear=new Date(this.Athlete.date_of_birth).getFullYear();
    //     let currentYear = new Date().getFullYear();
    //     let difference=currentYear - selectYear;
    //     if(difference <= 4){
    //         setTimeout(() => {
    //         swal('Date of birth is not valid year!');
    //         this.Athlete.date_of_birth=null;
    //     }, 1000);
    //     }}
}
