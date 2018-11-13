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
// import { PreActivity } from './../add-activity/models/pre_activity';
@Component({
    selector: 'app-activity-management',
    templateUrl: './activity-management.component.html',
    styleUrls: ['./activity-management.component.css']
})
export class ActivityManagementComponent implements OnInit {
    datatable: any;
    userRole = localStorage.getItem('userRole');
    constructor(private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _http: Http,
        private _alertService: AlertService,
        private _toastrService: ToastrService,
        private elRef: ElementRef) {
        this.userRole = localStorage.getItem('userRole');
        this.getListUsers();
        // alert(this._route.snapshot.paramMap.get('custId'));
    }
    getListUsers() {
        return this._http.get(this._root.root_url)
            .subscribe(res => {
                let listofUsers = res.status;
                console.log(listofUsers);
            });
    }

    ngOnInit() {
        let options = {
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        // sample GET method
                        method: 'GET',
                        url: this._root.root_url + '/activities',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),
                            'Content-Type': 'application/json'
                        },
                        map: function(raw) {

                            // sample data mapping
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
                pageSize: 10,
                // serverPaging: true,
                // serverFiltering: true,
                // serverSorting: true,
            },
            // layout definition
            layout: {
                scroll: false,
                footer: false
            },
            // column sorting
            sortable: true,
            pagination: true,
            toolbar: {
                // toolbar items
                items: {
                    // pagination
                    pagination: {
                        // page size select
                        pageSizeSelect: [10, 20, 30, 50, 100],
                    },
                },
            },
            search: {
                input: $('#generalSearch'),
            },
            // columns definition
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
                //     field: 'RecordID',
                //     title: '#',
                //     sortable: false, // disable sort for this column
                //     width: 40,
                //     textAlign: 'center',
                //     selector: { class: 'm-checkbox--solid m-checkbox--brand' },
                // },
                {
                    field: 'name',
                    title: 'Activity',
                    filterable: true,
                    sortable: 'dsc',
                    width: 150,
                },
                {
                    field: 'sport.sport_name',
                    title: 'Sport',
                    filterable: true,
                    sortable: 'dsc',
                    width: 150,
                },
                {
                    field: 'created_at',
                    title: 'Created On',
                    filterable: true,
                    sortable: true,
                    width: 150,
                    template: function(row, index, datatable) {
                        var date = (row.created_at);
                        var date = date.substr(0, 10);
                        return '\<label>' + date + '</label>';
                    },
                },
                {
                    field: 'no_of_participant',
                    title: '# Athletes',
                    width: 100,
                    filterable: true,
                    sortable: true,

                },

                {
                    field: 'created_by_user.first_name',
                    title: 'Created By',
                    filterable: true,
                    sortable: true,
                    width: 150,
                },


                {
                    field: 'Actions',
                    width: 170,
                    title: 'Actions',
                    sortable: false,
                    overflow: 'visible',

                    template: function(row, index, datatable) {
                        return '\<a data-id="' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-delete" title="Delete"><i class="la la-trash"></i></a>\
                        <a data-id="'+ row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-activities-edit" title="Edit" ><i class="la la-pencil-square"></i></a>\
                      ';


                        //   return '\<a data-id="' + row.id + '" data-email="' + row.email + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-reset" title="Reset Password"><i class="la la-refresh"></i></a>\
                        //   <a data-id="'+ row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-delete" title="Delete"><i class="la la-trash"></i></a>\
                        //   ';


                    },
                }
            ],
        }
        this.datatable = (<any>$('.m_datatable')).mDatatable(options);
        this.getListUsers();

    }




    onAthletes() {
        this._router.navigate(['/refresh-athletes']);
        let activityIDS: any = 0;
        localStorage.setItem('preActivityID', activityIDS);
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
                return deleteUser._http.delete(root_url + '/activities/' + custId, { headers: headers })
                    .subscribe((res: Response) => {
                        _self._toastrService.Warning("The Activity has been deleted successfully", "Delete Activity");
                        _self._router.navigateByUrl('/refresh-activity');
                    });
            });
            $(_self.elRef.nativeElement).find('.m-portlet__nav-link.btn.m-btn.m-btn--hover-accent.m-btn--icon.m-btn--icon-only.m-btn--pill.btn-edit-athlete').click(function() {
                let custId = $(this).data('id');
                let headers = new Headers();
                let currentUser = localStorage.getItem('currentUser');
                headers.append('Authorization', 'Bearer ' + currentUser);
                headers.append('Content-Type', 'application/json');
                _self._router.navigateByUrl('/edit-athlete/' + custId);
                // return deleteUser._http.delete(root_url + '/athletes/' + custId, { headers: headers })
                //     .subscribe((res: Response) => {
                //         _self._router.navigateByUrl('/refresh-athlete');
                //     });
            });

        });

        this.datatable.on('m-datatable--on-layout-updated', function(e) {
            $(_self.elRef.nativeElement).find('.m-portlet__nav-link.btn.m-btn.m-btn--hover-primary.m-btn--icon.m-btn--icon-only.m-btn--pill.btn-activities-edit').click(function() {
                let custId = $(this).data('id');

                _self._router.navigate(['/add-activity/', custId]);

            });

        });
    }





}