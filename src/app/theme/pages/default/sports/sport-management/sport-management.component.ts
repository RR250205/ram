import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UrlHandlerService } from '../../../../../_services/url-handler.service';
import { ToastrService } from '../../../../../_services/toastr.service';
import { Subject } from 'rxjs/Subject';


@Component({
    selector: "app-sport-management",
    templateUrl: "./sport-management.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class SportManagementComponent implements OnInit {
    datatable: any;
    userRole = localStorage.getItem('userRole');
    getListUsers() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');

        return this._http.get(this._root.root_url + '/sports', { headers: headers })
            .subscribe(res => {
                let listofUsers = res;
                console.log(listofUsers);
            });
    }
    constructor(private _script: ScriptLoaderService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _root: UrlHandlerService,
        private _toastrService: ToastrService,
        private _http: Http,
        private _alertService: AlertService,
        private elRef: ElementRef) {
        this.getListUsers();
    }
    ngOnInit() {
        let userRole = localStorage.getItem('userRole');
        if (userRole == 'true') {
            let options = {
                // datasource definition
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            // sample GET method
                            method: 'GET',
                            url: this._root.root_url + '/sports/all',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),
                                'Content-Type': 'application/json'
                            },
                            map: function(raw) {
                                console.log(raw);
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
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
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
                    {
                        field: 'sport_name',
                        title: 'Sport Name',
                        filterable: true,
                        sortable: true,
                        width: 150,
                    },
                    {
                        field: 'description',
                        title: 'Description',
                        filterable: true,
                        sortable: true,
                        width: 250,
                    },

                    {
                        field: 'Deactivate',
                        width: 170,
                        title: 'Activate / Inactivate',
                        sortable: false,
                        overflow: 'visible',
                        template: function(row, index, datatable) {
                            var checkStatus = (row.is_active) == true ? 'Active' : 'Inactive';
                            if (checkStatus == "Active") {
                                return '\<span class="m-switch m-switch--icon m-switch--success"><label><input data-id="' + row.id + '" type="checkbox" data-is_active="' + row.is_active + '" checked="checked" name="" class="listUsersActivate" /><span></span></label></span>';
                            }
                            else if (checkStatus == "Inactive") {
                                return '\<span class="m-switch m-switch--icon m-switch--success"><label><input data-id="' + row.id + '" type="checkbox" data-is_active="' + row.is_active + '" name="" class="listUsersActivate" /><span></span></label></span>';
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
                            return '\<a data-id="' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-edit" title="Edit details"><i class="la la-edit"></i></a>\
                        <a data-id="'+ row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-delete" title="Delete"><i class="la la-trash"></i></a>\
                        ';
                        },
                    }],
            }
            this.datatable = (<any>$('.m_datatable')).mDatatable(options);
        } else {
            let options = {
                // datasource definition
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            // sample GET method
                            method: 'GET',
                            url: this._root.root_url + '/sports/all',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),
                                'Content-Type': 'application/json'
                            },
                            map: function(raw) {
                                console.log(raw);
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
                    {
                        field: 'sport_name',
                        title: 'Sport Name',
                        filterable: true,
                        sortable: true,
                        width: 150,
                    },
                    {
                        field: 'description',
                        title: 'Description',
                        filterable: true,
                        sortable: true,
                        width: 250,
                    }],
            }
            this.datatable = (<any>$('.m_datatable')).mDatatable(options);
        }
    }

    ngAfterViewInit() {
        let _self = this;
        let deleteUser = this;
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        let root_url = this._root.root_url;
        this.datatable.on('m-datatable--on-layout-updated', function(e) {
            $(_self.elRef.nativeElement).find('.m-portlet__nav-link.btn.m-btn.m-btn--hover-danger.m-btn--icon.m-btn--icon-only.m-btn--pill.btn-delete').click(function() {
                let custId = $(this).data('id');
                return _self._http.delete(root_url + '/sports/' + custId, { headers: headers })
                    .subscribe((res: Response) => {
                        let message = res.json();
                        console.log("Message" + message.message);
                        _self._toastrService.Error(message.message, 'Delete Sport');
                        _self._router.navigateByUrl('/refresh-sport');

                    });
            });
            $(_self.elRef.nativeElement).find('.m-portlet__nav-link.btn.m-btn.m-btn--hover-accent.m-btn--icon.m-btn--icon-only.m-btn--pill.btn-edit').click(function() {
                let custId = $(this).data('id');
                console.log(custId);
                let headers = new Headers();
                let currentUser = localStorage.getItem('currentUser');
                headers.append('Authorization', 'Bearer ' + currentUser);
                headers.append('Content-Type', 'application/json');
                _self._router.navigateByUrl('/edit-sport/' + custId);
            });
            $(_self.elRef.nativeElement).find('.listUsersActivate').click(function() {
                let custId = $(this).data('id');
                let status = $(this).data('is_active');
                let headers = new Headers();
                let currentUser = localStorage.getItem('currentUser');
                headers.append('Authorization', 'Bearer ' + currentUser);
                if (status == true) {
                    return deleteUser._http.get(root_url + '/sports/' + custId + '/deactivate', { headers: headers })
                        .subscribe((res: Response) => {
                            console.log(res);
                            _self._router.navigateByUrl('/refresh-sport');
                        });
                }
                else if (status != true) {
                    return deleteUser._http.get(root_url + '/sports/' + custId + '/activate', { headers: headers })
                        .subscribe((res: Response) => {
                            console.log(res);
                            _self._router.navigateByUrl('/refresh-sport');
                        });
                }
            });
        });

    }


}
