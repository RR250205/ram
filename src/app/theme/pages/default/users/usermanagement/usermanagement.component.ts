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
declare var toastr: any;


@Component({
    selector: "app-user-management",
    templateUrl: "./usermanagement.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class UsermanagementComponent implements OnInit {
    datatable: any;
    myRole;
    is_admin: any = {
        is_admin: Boolean
    };
    constructor(private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _http: Http,
        private _alertService: AlertService,
        private _toastrService: ToastrService,
        private elRef: ElementRef) {
        this.getListUsers();

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
                        url: this._root.root_url + '/users',
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
                {
                    field: 'first_name',
                    title: 'First Name',
                    width: 120,
                    filterable: true,
                    sortable: true,

                },

                {
                    field: 'email',
                    title: 'Email',
                    width: 260,
                    filterable: true,
                    sortable: true,
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
                    field: 'is_admin',
                    title: 'Role',
                    width: 100,
                    filterable: true,
                    sortable: true,
                    template: function(row) {
                        var userRole = (row.is_admin) == true ? 'Admin' : 'User';

                        if (userRole == 'Admin') {
                            return '<span class="m-badge m-badge--success m-badge--wide">' + userRole + '</span>';
                        }
                        else if (userRole == 'User') {
                            return '<span class="m-badge m-badge--danger m-badge--wide">' + userRole + '</span>';
                        }
                    }
                },
                {
                    field: 'Deactivate',
                    width: 100,
                    title: 'Inactivate / Activate ',
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

                    }
                },


                {
                    field: 'aciveRole',
                    width: 100,
                    title: 'Change Role',
                    sortable: false,
                    overflow: 'visible',
                    template: function(row, index, datatable) {
                        var checkRole = (row.is_admin) == true ? 'Admin' : 'User';
                        console.log(checkRole, row.is_admin);
                        if (checkRole == 'Admin') {
                            return '\<span class="m-switch m-switch--icon m-switch--success"><label><input data-id="' + row.id + '" type="checkbox" data-is_admin="' + row.is_admin + '" checked="checked" name="" class="listUsersRole" /><span></span></label></span>';
                        }
                        else {
                            return '\<span class="m-switch m-switch--icon m-switch--success"><label><input data-id="' + row.id + '" type="checkbox" data-is_admin="' + false + '" name="" class="listUsersRole" /><span></span></label></span>';
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
                        return '\<a data-id="' + row.id + '" data-email="' + row.email + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-reset" title="Reset Password"><i class="la la-refresh"></i></a>\
                        <a data-id="'+ row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-delete" title="Delete"><i class="la la-trash"></i></a>\
                        ';
                    },
                }],
        }
        this.datatable = (<any>$('.m_datatable')).mDatatable(options);

    }

    getListUsers() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');

        return this._http.get(this._root.root_url + '/users', { headers: headers })
            .subscribe(res => {
                let listofUsers = res;
                // this._router.navigateByUrl('/refresh');
            });
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
                return _self._http.delete(root_url + '/users/' + custId, { headers: headers })
                    .subscribe((res: Response) => {
                        let dataDelet = res.json();
                        _self._toastrService.Warning(dataDelet.message, "Delete User");
                        console.log(dataDelet.message);
                        _self._router.navigateByUrl('/refresh');
                    });
            });
            $(_self.elRef.nativeElement).find('.m-portlet__nav-link.btn.m-btn.m-btn--hover-accent.m-btn--icon.m-btn--icon-only.m-btn--pill.btn-reset').click(function() {
                let custId = $(this).data('id');
                let email = $(this).data('email');
                let headers = new Headers();
                let currentUser = localStorage.getItem('currentUser');
                headers.append('Authorization', 'Bearer ' + currentUser);
                headers.append('Content-Type', 'application/json');
                email = { email };
                return deleteUser._http.post(root_url + '/passwords/reset', email, { headers: headers })
                    .subscribe((res) => {
                        let oReset = res.json();
                        _self._toastrService.Success(oReset.message, "Reset Password");
                    },
                    error => {
                        let err = error.json();
                        _self._toastrService.Warning(err.message, "Reset Password");
                    });
            });
            $(_self.elRef.nativeElement).find('.listUsersActivate').click(function() {
                let custId = $(this).data('id');
                let status = $(this).data('is_active');
                let headers = new Headers();
                let currentUser = localStorage.getItem('currentUser');
                headers.append('Authorization', 'Bearer ' + currentUser);
                if (status == true) {
                    return deleteUser._http.get(root_url + '/users/' + custId + '/deactivate', { headers: headers })
                        .subscribe((res: Response) => {
                            console.log(res);
                            // let text=res.json();
                            // this._toastrService.Success(text.message);
                            _self._router.navigateByUrl('/refresh');
                            // window.location.reload();
                        });
                }
                else if (status != true) {

                    return deleteUser._http.get(root_url + '/users/' + custId + '/activate', { headers: headers })
                        .subscribe((res: Response) => {
                            console.log(res);
                            //     let text=res.json();
                            //    this._toastrService.success(text.message);
                            _self._router.navigateByUrl('/refresh');
                            // window.location.reload();
                        });
                }
            });
            $(_self.elRef.nativeElement).find('.listUsersRole').click(function() {
                let custId = $(this).data('id');
                let is_admin: String = $(this).data('is_admin').toString();
                console.log("Current Status: " + is_admin);
                is_admin = is_admin == "true" ? "false" : "true";                
                let role = {
                    "is_admin": is_admin
                };
                console.log(role);
                let headers = new Headers();
                let currentUser = localStorage.getItem('currentUser');
                headers.append('Authorization', 'Bearer ' + currentUser);
                headers.append('Content-Type', 'application/json');
                return deleteUser._http.put(root_url + '/roles/' + custId + '/update_role', role, { headers: headers })
                    .subscribe((res: Response) => {
                        console.log(res);
                        _self._router.navigateByUrl('/refresh');
                    });
                // if (is_admin == 'true') {
                //     return deleteUser._http.put(root_url + '/roles/' + custId + '/update_role', role, { headers: headers })
                //         .subscribe((res: Response) => {
                //             console.log(res);
                //             _self._router.navigateByUrl('/refresh');
                //         });
                // }
                // else if (is_admin == 'false') {
                //     return deleteUser._http.put(root_url + '/roles/' + custId + '/update_role', role, { headers: headers })
                //         .subscribe((res: Response) => {
                //             console.log(res);
                //             _self._router.navigateByUrl('/refresh');
                //         });
                // }
                // else if (is_admin == null) {
                //     let role = {
                //         is_admin: 'true'
                //     };
                //     return deleteUser._http.put(root_url + '/roles/' + custId + '/update_role', role, { headers: headers })
                //         .subscribe((res: Response) => {
                //             console.log(res);
                //             _self._router.navigateByUrl('/refresh');
                //         });
                // }
            });
        });

    }


}
