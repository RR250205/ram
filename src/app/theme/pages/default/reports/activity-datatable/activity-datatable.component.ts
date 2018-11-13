import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UrlHandlerService } from '../../../../../_services/url-handler.service';
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";


@Component({
    selector: "app-activity-datatable",
    templateUrl: "./activity-datatable.component.html",
    encapsulation: ViewEncapsulation.None,
})
@NgModule({
    imports: [
        FormsModule
    ],
})

export class ActivityDatatableComponent implements OnInit {
    model: any = {};
    options: any;
    datatable: any;
    preferredUnitID: any = localStorage.getItem('preferedUnit');
    constructor(private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _http: Http,
        private _alertService: AlertService) {
    }
    ngOnInit() {


        this.options = {
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        // sample GET method
                        method: 'GET',
                        url: this._root.root_url + '/activity',
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
            // sortable: true,
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
                    field: 'user.first_name',
                    title: 'User First Name',
                    filterable: true,
                    // sortable: 'dsc',
                    width: 150,
                },
                {
                    field: 'user.last_name',
                    title: 'User Last Name',
                    filterable: true,
                    // sortable: 'dsc',
                    width: 150,
                },
                {
                    field: 'athlete.first_name',
                    title: 'Athlete First Name',
                    filterable: true,
                    sortable: 'dsc',
                    width: 150,
                },
                {
                    field: 'athlete.last_name',
                    title: 'Athlete Last Name',
                    filterable: true,
                    sortable: 'dsc',
                    width: 150,
                },
                {
                    field: 'preactivity.name',
                    title: 'Activity Name<small>&nbsp;</small>',
                    filterable: true,
                    width: 150,
                },
                {
                    field: 'date',
                    title: 'Date <br/><small>(yyyy-mm-dd)</small>',
                    filterable: false,
                    width: 100,
                },

                {
                    field: 'time',
                    title: 'Time <br/><small>(hh:mm:ss)</small>',
                    filterable: true,
                    // sortable: 'dsc',
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
                    field: 'preactivity.type_of_training',
                    title: 'Type of Training',
                    filterable: true,
                    sortable: 'dsc',
                    width: 150,
                },
                {
                    field: 'location',
                    title: 'Location',
                    filterable: true,
                    sortable: 'dsc',
                    width: 150,
                },
                {
                    field: 'preactivity.description',
                    title: 'Description',
                    filterable: true,
                    // sortable: true,
                    width: 150,

                },
                {
                    field: 'weather',
                    title: 'Indoor/Outdoor',
                    filterable: true,
                    // sortable: true,
                    width: 150,
                },
                {
                    field: 'temperature',
                    title: this.preferredUnitID == '1' ? 'Temperature <br/><small>(&#x2218;C)</small>' : 'Temperature <br/><small>(&#x2218;F)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'water_temp',
                    title: 'Water Temp',
                    filterable: true,
                    // sortable: true,
                    width: 150,
                },
                {
                    field: 'humidity',
                    title: 'Humidity',
                    filterable: true,
                    sortable: true,
                    width: 150,
                },
                {
                    field: 'preactivity.wind_speed',
                    title: 'Wind Speed',
                    filterable: true,
                    sortable: true,
                    width: 150,
                },
                {
                    field: 'cloud',
                    title: 'Cloud Cover',
                    filterable: true,
                    sortable: true,
                    width: 150,
                },
                {
                    field: 'wbgt',
                    title: 'WBGT',
                    filterable: true,
                    sortable: true,
                    width: 150,
                },  
                {
                    field: 'acclimatized',
                    title: 'Acclimatized',
                    filterable: true,
                    sortable: true,
                    width: 150,
                },       
                {
                    field: 'weight_before_nude',
                    title: this.preferredUnitID == '1' ? 'Pre-exercise weight without clothes <br/><small>(kg)</small>' : 'Pre-exercise weight without clothes <br/><small>(lbs)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'weight_before_cloths',
                    title: this.preferredUnitID == '1' ? 'Pre-exercise weight with clothes <br/><small>(kg)</small>' : 'Pre-exercise weight with clothes <br/><small>(lbs)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'cloth_description',
                    title: 'Description of Clothes',
                    filterable: false,
                    width: 100,
                },  
                {
                    field: 'urine_specific_gravity',
                    title: 'Urine Specific Gravity',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'weight_after_nude',
                    title: this.preferredUnitID == '1' ? 'Post-exercise weight without clothes <br/><small>(kg)</small>' : 'Post-exercise weight without clothes <br/><small>(lbs)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'weight_after_cloths',
                    title: this.preferredUnitID == '1' ? 'Post-exercise weight with clothes <br/><small>(kg)</small>' : 'Post-exercise weight with clothes <br/><small>(lbs)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'total_fluid',
                    title: this.preferredUnitID == '1' ? 'Fluids <br/><small>(ml)</small>' : 'Fluids <br/><small>(fl oz)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'gels_solid',
                    title: this.preferredUnitID == '1' ? 'Gels/Solid <br/><small>(g)</small>' : 'Gels/Solid <br/><small>(fl oz)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'urination',
                    title: this.preferredUnitID == '1' ? 'Urination <br/><small>(ml)</small>' : 'Urination<br/><small>(fl oz)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'duration',
                    title: 'Duration <br/><small>(hh:mm:ss)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'distance',
                    title: this.preferredUnitID == '1' ? 'Distance <br/><small>(km)</small>' : 'Distance <br/><small>(mi)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'average_power',
                    title: 'Average Power <br/><small>(Watts)</small>',                    
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'internal_load_RPE',
                    title: 'Internal load RPE',                    
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'active_precent',
                    title: 'Active %',                    
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'hydration_notes',
                    title: 'Hydration Notes',
                    filterable: true,
                    // sortable: true,
                    width: 150,
                },
                // {
                //     field: 'weight_before_nude',
                //     title: this.preferredUnitID == '1' ? 'Weight Before <br/><small>(kg)</small>' : 'Weight After <br/><small>(lbs)</small>',
                //     filterable: false,
                //     width: 100,
                // },
                // {
                //     field: 'weight_after_nude',
                //     title: this.preferredUnitID == '1' ? 'Weight After <br/><small>(kg)</small>' : 'Weight After <br/><small>(lbs)</small>',
                //     filterable: false,
                //     width: 100,
                // },
                // {
                //     field: 'total_fluid',
                //     title: this.preferredUnitID == '1' ? 'Hydration <br/><small>(l)</small>' : 'Hydration <br/><small>(fl oz)</small>',
                //     filterable: false,
                //     width: 100,
                // },
                // {
                //     field: 'effort',
                //     title: 'Effort',
                //     filterable: false,
                //     width: 100,
                // },
              
                {
                    field: 'sweatrate',
                    title: 'Sweat Rate <br/><small>(l/hr)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'weight_loss',
                    title: 'Weight Loss <br/><small>(KG)</small>',
                    filterable: false,
                    width: 100,
                },
                {
                    field: 'dehydration',
                    title: 'Dehydration %',
                    filterable: false,
                    width: 100,
                },


              


                // {
                //     field: 'Actions',
                //     width: 170,
                //     title: 'Actions',
                //     sortable: false,
                //     overflow: 'visible',

                //     template: function (row, index, datatable) {
                //         return '\<a data-id="' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-delete" title="Delete"><i class="la la-trash"></i></a>\
                //         <a data-id="'+ row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-activities-edit" title="Edit" ><i class="la la-pencil-square"></i></a>\
                //       ';


                //         //   return '\<a data-id="' + row.id + '" data-email="' + row.email + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-reset" title="Reset Password"><i class="la la-refresh"></i></a>\
                //         //   <a data-id="'+ row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-delete" title="Delete"><i class="la la-trash"></i></a>\
                //         //   ';


                //     },
                // }
            ],

        }

setTimeout(() => {
    this.datatable = (<any>$('.m_datatable')).mDatatable(this.options);    
}, 1000);



        //  this._router.navigateByUrl('/refresh-reports');

    }
    ngAfterViewInit() {

        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/components/base/toastr.js');

        // this._router.navigateByUrl('../refresh-reports');
        // this._router.navigate(['/refresh-report-management']);

    }
    reloadMethod() {
        this.ngOnInit()
    }
    onXls() {

        let currentUser = localStorage.getItem('currentUser');
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/vnd.ms-excel;charset=utf-8');
        headers.append('Content-Encoding', 'gzip');
        let _self = this;
        _self._http.get(this._root.root_url + '/activity_export', { headers: headers })
            .subscribe(dataxls => this.downloadFileXls(dataxls)),
            error => console.log('Error downloading the file.'),
            () => console.info('OK');


    }



    dateNow: Date = new Date();
    dateNowISO = this.dateNow.toISOString();
    dateNowMilliseconds = this.dateNow.getTime();


    downloadFileXls(dataxls: any) {
        let parsedResponse = dataxls.text();
        let blob = new Blob([parsedResponse], { type: 'text/Xls' });
        let url = window.URL.createObjectURL(blob);

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, "Activities_" + this.dateNowISO + ".xls");
        } else {
            let a = document.createElement('a');
            a.href = url;
            a.download = "Activities_" + this.dateNowISO + ".xls";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        window.URL.revokeObjectURL(url);
    }
    onCsv() {

        let currentUser = localStorage.getItem('currentUser');
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/csv;charset=utf-8');
        headers.append('Content-Encoding', 'gzip');


        let _self = this;
        _self._http.get(this._root.root_url + '/activity_export', { headers: headers })
            // .subscribe((res: Response) => {
            //     this
            //     console.log(res);
            //     //let athlete = res.json();
            //    // _self._toastrService.Success(' Activity report sent successfully', 'Hello '+athlete.first_name );

            // });
            .subscribe(data => this.downloadFile(data)),
            error => console.log('Error downloading the file.'),
            () => console.info('OK');

    }



    downloadFile(data: any) {
        let parsedResponse = data.text();
        let blob = new Blob([parsedResponse], { type: 'text/csv' });
        let url = window.URL.createObjectURL(blob);

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, "Activities_" + this.dateNowISO + ".csv")
        } else {
            let a = document.createElement('a');
            a.href = url;
            a.download = "Activities_" + this.dateNowISO + ".csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        window.URL.revokeObjectURL(url);
    }


}
