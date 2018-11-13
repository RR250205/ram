import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/map";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UrlHandlerService } from '../../../../../_services/url-handler.service';
import { ToastrService } from '../../../../../_services/toastr.service';


@Component({
    selector: 'app-athlete-management',
    templateUrl: './athlete-management.component.html',
    styleUrls: ['./athlete-management.component.css']
})
export class AthleteManagementComponent implements OnInit {

    datatable: any;

    constructor(private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _http: Http,
        private _alertService: AlertService,
        private _toastrService: ToastrService,
        private elRef: ElementRef) {
        console.log('Constructor Called!');
        this.getListUsers();
        let userRole = localStorage.getItem('userRole');
        console.log(userRole);
    }
    getListUsers() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');

        return this._http.get(this._root.root_url + '/athletes', { headers: headers })
            .subscribe(res => {
                this.ngOnInit();
                let listofUsers = res.json();

            });
    }
    ngOnInit() {
        let userRole: any = localStorage.getItem('userRole');

        console.log(userRole);
        if (userRole == 'true') {
            let options = {
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            method: 'GET',
                            url: this._root.root_url + '/athletes/all',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),
                                'Content-Type': 'application/json'
                            },
                            map: function(raw) {
                                console.log(raw);
                                var dataSet = raw;
                                if (typeof raw.data !== 'undefined') {
                                    dataSet = raw.data;
                                }
                                return dataSet;
                            },
                        },
                    },
                    pageSize: 10,
                },
                layout: {
                    scroll: false,
                    footer: false
                },
                sortable: true,
                pagination: true,
                toolbar: {
                    items: {
                        pagination: {
                            pageSizeSelect: [10, 20, 30, 50, 100],
                        },
                    },
                },
                search: {
                    input: $('#generalSearch'),
                },
                columns: [
                    {
                        field: '',
                        title: 'S.No',
                        sortable: false, // disable sort for this column
                        width: 40,
                        selector: false,
                        textAlign: 'center',
                        template: function(row, index, datatable) {
                            return index + 1;
                        },
                    },
                    // {
                    //     field: 'profile_picture',
                    //     title: '',
                    //     width: 50,
                    //     template: function(row, index, datatable) {
                    //         // template: function (row, index, datatable) {
                    //         return row.profile_picture ? '\<img style="width:50px; margin-right:20px;" class="athlete-images" alt="' + row.first_name + '" src="' + row.profile_picture + '" />' :
                    //             '\<img style="width:50px; margin-right:20px;" class="athlete-images" alt="' + row.first_name + '" src="/assets/images/profile.png"/>';
                    //     },

                    // },
                    {
                        field: 'active',
                        title: '',
                        filterable: true,
                        // sortable: 'dsc',
                        width: 50,
                        template: function(row, index, datatable) {

                            var profilePic = (row.profile_picture) != null ? 'Active' : 'Inactive';
                            if (profilePic == 'Active') {
                                return '\<img src="' + row.profile_picture + '" style="width:50px; margin-right:20px;" class="athlete-images" />' + '\
                                        ';
                                // return '<span><img style="margin-left:10px;height:50px;" src="./assets/images/team_nl.jpg" /></span>';
                            }
                            else if (profilePic == 'Inactive') {
                                return '\<img src="./assets/images/profile.png" style="width:50px; margin-right:20px;" class="athlete-images" />' + '\
                                      ';


                            }
                        },
                    },

                    {
                        field: 'first_name',
                        title: 'First Name',
                        filterable: true,
                        // sortable: 'dsc',
                        width: 150,

                    },
                    {
                        field: 'last_name',
                        title: 'Last Name',
                        filterable: true,
                        sortable: 'asc',
                        width: 150,
                    },
                    {
                        field: 'sport.sport_name',
                        title: 'Primary Sport',
                        filterable: true,
                        sortable: false,
                        // sortable: 'desc',
                        width: 150,
                    },
                    {
                        field: 'is_team_nl',
                        title: 'Team NL',
                        filterable: true,
                        sortable: false,
                        width: 150,
                        template: function(row, index, datatable) {

                            var dropup = (row.is_team_nl) == true ? 'Active' : 'Inactive';
                            if (dropup == 'Active') {
                                return '<span><img style="margin-left:10px;height:50px;" src="./assets/images/team_nl.jpg" /></span>';
                            }
                            else if (dropup == 'Inactive') {
                                return '<span style="margin-left: 25px;">-</span>';
                            }
                        },
                    },
                    // {
                    //     field: 'is_active',
                    //     title: 'Status',
                    //     width: 100,
                    //     filterable: true,
                    //     sortable: true,
                    //     template: function (row) {
                    //         var dropup = (row.is_active) == true ? 'Active' : 'Inactive';
                    //         if (dropup == 'Active') {
                    //             return '<span class="m-badge m-badge--success m-badge--wide">' + dropup + '</span>';
                    //         }
                    //         else if (dropup == 'Inactive') {
                    //             return '<span class="m-badge m-badge--danger m-badge--wide">' + dropup + '</span>';
                    //         }
                    //     }
                    // },
                    {
                        field: 'Deactivate',
                        width: 170,
                        title: 'Inactivate / Activate',
                        sortable: false,
                        overflow: 'visible',
                        template: function(row, index, datatable) {
                            var checkStatus = (row.is_active) == true ? 'Active' : 'Inactive';
                            if (checkStatus == "Active") {
                                return '\<span style="margin-left: 10px;" class="m-switch m-switch--icon m-switch--success"><label><input data-id="' + row.id + '" type="checkbox" data-is_active="' + row.is_active + '" checked="checked" name="" class="listAthletesActivate" /><span></span></label></span>';
                            }
                            else if (checkStatus == "Inactive") {
                                return '\<span style="margin-left: 10px;" class="m-switch m-switch--icon m-switch--success"><label><input data-id="' + row.id + '" type="checkbox" data-is_active="' + row.is_active + '" name="" class="listAthletesActivate" /><span></span></label></span>';
                            }
                        },
                    },
                    {
                        field: 'Actions',
                        width: 170,
                        title: 'Actions',
                        sortable: false,
                        overflow: 'visible',

                        template: function(row, index, datatable) {
                            return '\<a data-id="' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-edit-athlete" title="Edit details"><i class="la la-edit"></i></a>\<a data-id="' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-delete" title="Delete"><i class="la la-trash"></i></a>\
                      ';
                        },
                    }
                ],
            }
            this.datatable = (<any>$('.m_datatable.athlete_management')).mDatatable(options);
        }
        else {
            let options = {
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            method: 'GET',
                            url: this._root.root_url + '/athletes/all',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),
                                'Content-Type': 'application/json'
                            },
                            map: function(raw) {
                                console.log(raw);
                                var dataSet = raw;
                                if (typeof raw.data !== 'undefined') {
                                    dataSet = raw.data;
                                }
                                return dataSet;
                            },
                        },
                    },
                    pageSize: 10,
                },
                layout: {
                    scroll: false,
                    footer: false
                },
                sortable: true,
                pagination: true,
                toolbar: {
                    items: {
                        pagination: {
                            pageSizeSelect: [10, 20, 30, 50, 100],
                        },
                    },
                },
                search: {
                    input: $('#generalSearch'),
                },
                columns: [
                    {
                        field: '',
                        title: 'S.No',
                        sortable: false, // disable sort for this column
                        width: 40,
                        selector: false,
                        textAlign: 'center',
                        template: function(row, index, datatable) {
                            return index + 1;
                        },
                    },
                    {
                        field: 'active',
                        title: '',
                        filterable: true,
                        // sortable: 'dsc',
                        width: 50,
                        template: function(row, index, datatable) {

                            var profilePic = (row.profile_picture) != null ? 'Active' : 'Inactive';
                            if (profilePic == 'Active') {
                                return '\<img src="' + row.profile_picture + '" style="width:50px; margin-right:20px;" class="athlete-images" />' + '\
                                        ';
                                // return '<span><img style="margin-left:10px;height:50px;" src="./assets/images/team_nl.jpg" /></span>';
                            }
                            else if (profilePic == 'Inactive') {
                                return '\<img src="./assets/images/profile.png" style="width:50px; margin-right:20px;" class="athlete-images" />' + '\
                                      ';


                            }
                        },
                        // template: function(row, index, datatable) {
                        //     if (row.profile_picture != "") {
                        //         return '\<img src="' + row.profile_picture + '" style="width:50px; margin-right:20px;" class="athlete-images" />' + row.first_name + '\
                        //         ';
                        //     }
                        //     else {
                        //         return '\<img src="./assets/images/profile.pn" style="width:50px; margin-right:20px;" class="athlete-images" />' + row.first_name + '\
                        //         ';
                        //     }
                        // },
                    },
                    {
                        field: 'first_name',
                        title: 'First Name',
                        filterable: true,
                        sortable: 'asc',
                        width: 150,
                    },
                    {
                        field: 'last_name',
                        title: 'Last Name',
                        filterable: true,
                        sortable: 'asc',
                        width: 150,
                    },
                    {
                        field: 'sport.sport_name',
                        title: 'Sports',
                        filterable: true,
                        sortable: true,
                        width: 150,
                    },
                    {
                        field: 'is_team_nl',
                        title: 'Team NL',
                        filterable: true,
                        sortable: true,
                        width: 150,
                        template: function(row, index, datatable) {

                            var dropup = (row.is_team_nl) == true ? 'Active' : 'Inactive';
                            if (dropup == 'Active') {
                                return '<span><img style="margin-left:10px;height:50px;" src="./assets/images/team_nl.jpg" /></span>';
                            }
                            else if (dropup == 'Inactive') {
                                return '<span style="margin-left: 25px;">-</span>';
                            }
                        },
                    },
                    {
                        field: 'is_active',
                        title: 'Status',
                        width: 100,
                        filterable: true,
                        sortable: true,
                        template: function(row) {
                            var dropup = (row.is_active) == true ? 'Active' : 'Inactive';
                            if (dropup == 'Active') {
                                return '<span class="m-badge m-badge--success m-badge--wide">' + dropup + '</span>';
                            }
                            else if (dropup == 'Inactive') {
                                return '<span class="m-badge m-badge--danger m-badge--wide">' + dropup + '</span>';
                            }
                        }
                    },
                    {
                        field: 'Actions',
                        width: 170,
                        title: 'Actions',
                        sortable: false,
                        overflow: 'visible',
                        template: function(row, index, datatable) {
                            return '\<a data-id="' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-edit-athlete" title="Edit details"><i class="la la-edit"></i></a>\
                      ';
                        },
                    }
                ],
            }
            this.datatable = (<any>$('.m_datatable.athlete_management')).mDatatable(options);
        }
    }

    ngAfterViewInit() {
        this.ngOnInit();
        let _self = this;
        let deleteUser = this;
        let root_url: string = this._root.root_url;
        this.datatable.on('m-datatable--on-layout-updated', function(e) {
            $(_self.elRef.nativeElement).find('.m-portlet__nav-link.btn.m-btn.m-btn--hover-danger.m-btn--icon.m-btn--icon-only.m-btn--pill.btn-delete').click(function() {
                let custId = $(this).data('id');
                let headers = new Headers();
                let currentUser = localStorage.getItem('currentUser');
                headers.append('Authorization', 'Bearer ' + currentUser);
                headers.append('Content-Type', 'application/json');
                return deleteUser._http.delete(root_url + '/athletes/' + custId, { headers: headers })
                    .subscribe((res: Response) => {
                        let dataAthlete = res.json();
                        _self._toastrService.Warning(dataAthlete.message, "Delete Athletes");
                        console.log(dataAthlete.message);
                        _self._router.navigateByUrl('/refresh-athlete');
                    });
            });
            $(_self.elRef.nativeElement).find('.m-portlet__nav-link.btn.m-btn.m-btn--hover-accent.m-btn--icon.m-btn--icon-only.m-btn--pill.btn-edit-athlete').click(function() {
                let custId = $(this).data('id');
                let headers = new Headers();
                let currentUser = localStorage.getItem('currentUser');
                headers.append('Authorization', 'Bearer ' + currentUser);
                headers.append('Content-Type', 'application/json');
                _self._router.navigateByUrl('/edit-athlete/' + custId);
            });
            $(_self.elRef.nativeElement).find('.listAthletesActivate').click(function() {
                let custId = $(this).data('id');
                let status = $(this).data('is_active');
                let headers = new Headers();
                let currentUser = localStorage.getItem('currentUser');
                headers.append('Authorization', 'Bearer ' + currentUser);
                headers.append('Content-Type', 'application/json');
                if (status == true) {
                    return deleteUser._http.get(root_url + '/athletes/' + custId + '/deactivate', { headers: headers })
                        .subscribe((res: Response) => {
                            _self._router.navigateByUrl('/refresh-athlete');
                        });
                }
                else if (status != true) {
                    let headers = new Headers();
                    let currentUser = localStorage.getItem('currentUser');
                    headers.append('Authorization', 'Bearer ' + currentUser);
                    headers.append('Content-Type', 'application/json');
                    return deleteUser._http.get(root_url + '/athletes/' + custId + '/activate', { headers: headers })
                        .subscribe((res: Response) => {
                            console.log(res);
                            _self._router.navigateByUrl('/refresh-athlete');
                        });
                }
            });
        });
    }
}
