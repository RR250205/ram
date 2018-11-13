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
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Subject } from 'rxjs/Subject';
import { UrlHandlerService } from '../../../../../_services/url-handler.service';
import { UserService, AuthenticationService } from '../../../../../auth/_services';
import { ProfpictureService } from '../../../../../_services/profpicture.service';
import { ToastrService } from '../../../../../_services/toastr.service';
import { Technology } from './technology.model';
declare let $: any;

@Component({
    selector: "app-update-user",
    templateUrl: "./update-user.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class UpdateUserComponent implements OnInit {
    model: any = {
        firstname: String,
        lastname: String,
        email: String,
        gender: String,
        dob: String,
        mobile: String,
        phone: String,
        unit_id: String,
        address: String,
        profile_picture: String,
        athletesList: []
    };

    public athletes = [];
    public favourites = [];
    loading = false;
    updateUserAvatar: any;
    public imgID: any;
    public imageChangedEvent: any = '';
    public croppedImage: any;
    public baseImage: any = '';
    public imgUrl: any;
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
        private _toastr: ToastrService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
        this.getCurrentUser();
        this.getListAthletes();
        this.model.firstname = "";
        this.model.lastname = "";
        this.model.email = "";
        this.model.gender = "1";
        this.model.unit_id = "1";
        this.model.dob = "";
        this.model.mobile = "";
        this.model.phone = "";
        this.model.address = "";
        this.model.profile_picture = "";
    }
    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(image: any) {
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
    public getListAthletes() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._root.root_url + '/athletes', { headers: headers })
            .subscribe(res => {
                let listofAthletes = res.json();
                listofAthletes.forEach(element => {
                    this.athletes.push(element.first_name);
                });
            });
    }
    cancelUser() {
        this._router.navigate(['/index']);
    }
    public getCurrentUser() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        return this._http.get(this._root.root_url + '/profile', { headers: headers })
            .subscribe(res => {
                let listofUsers = res.json();
                this.model.first_name = listofUsers.user.first_name;
                this.model.last_name = listofUsers.user.last_name;
                this.model.email = listofUsers.user.email;
                this.model.gender = listofUsers.user.gender;
                console.log(this.model.gender);
                this.model.date_of_birth = listofUsers.user.date_of_birth;
                this.model.cell_number = listofUsers.user.cell_number;
                this.model.work_place_phone_number = listofUsers.user.work_place_phone_number;
                this.model.address = listofUsers.user.address;
                this.model.profile_picture = listofUsers.user.profile_picture;
                this.model.unit_id = listofUsers.user.unit_id;
                if (this.model.unit_id == 1) {
                    this.model.unit_id = "1";
                }
                else {
                    this.model.unit_id = "2";
                }
                this.favourites = listofUsers.athletes;
            });
    }

    ngOnInit() {
        // $('#m_select2_3').on('change', (e) => {
        //     debugger
        //     let data= $(e.target).val();
        //     console.log(data);
        //   });

    }
    ngAfterViewInit() {

        this._script.loadScripts('app-update-user',
            ['assets/demo/default/custom/components/forms/widgets/select2.js']);
        this._script.load('app-update-user',
            'assets/demo/default/custom/components/forms/validation/form-controls.js');
    }
    updateUser(model: any) {
        // this.model.first_name = model.value.first_name;
        console.log(model.value);
        if (model.form.valid) {
            let headers = new Headers();
            let currentUser = localStorage.getItem('currentUser');
            // let userTechnologies: Technology[] = model.controls['athletesList'].value;
            let img;
            if (this.croppedImage != null) {
                this.model.profile_picture = this.croppedImage;
            } else {
                this.model.profile_picture;
            }
            this.croppedImage! = "" ? this.croppedImage : this.model.profile_picture
            let user = {
                first_name: this.model.first_name,
                last_name: this.model.last_name,
                gender: this.model.gender,
                date_of_birth: this.model.date_of_birth,
                cell_number: this.model.cell_number,
                work_place_phone_number: this.model.work_place_phone_number,
                address: this.model.address,
                unit_id: this.model.unit_id,

                profile_picture: this.model.profile_picture
            };
            // console.log(user);
            headers.append('Authorization', 'Bearer ' + currentUser);
            headers.append('Content-Type', 'application/json');
            return this._http.put(this._root.root_url + '/profile', user, { headers: headers })
                .subscribe((res) => {
                    console.log(res);
                    localStorage.setItem("profileImage", user.profile_picture);
                    this._toastr.Info("User Has been Updated Successfully", "Update User");
                    location.reload();
                    this._router.navigate(['/index']);
                    localStorage.setItem("preferedUnit", user.unit_id);
                    console.log(user.unit_id);
                });
        }
    }







}
