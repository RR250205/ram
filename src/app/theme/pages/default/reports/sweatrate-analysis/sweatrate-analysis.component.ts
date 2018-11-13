import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';

import * as d3g from "d3";
declare var d3: any;
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { FormsModule } from '@angular/forms';
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UrlHandlerService } from '../../../../../_services/url-handler.service';
import { Subject } from 'rxjs/Subject';
import { ActivityList } from '../../activities/add-activity/models/activityList';
import { Activity } from '../../activities/add-activity/models/activity';
import { Activities } from '../../activities/add-activity/models/activities';
import { declaredViewContainer } from '@angular/core/src/view/util';
declare var jquery: any;
declare var $: any;
// import { Helpers} from '../../../../../helpers';
//import { PreActivity } from '../../activities/add-activity/models/pre_activity';



@Component({
    selector: "app-sweatrate-analysis",
    templateUrl: "./sweatrate-analysis.component.html",
    styleUrls: ['./sweatrate-analysis.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class SweatrateAnalysisComponent implements OnInit {
    datatable: any;
    options: any;
    gaugemap: any = {};
    // userRole = localStorage.getItem('userRole');
    preferredUnitID: any = localStorage.getItem('preferedUnit');
    activities = new Activities();
    activity = new Activity();
    result: any = [];
    maxValue = 5;
    gaugeValue: any;
    data;
    outofRange:boolean;


    constructor(private _script: ScriptLoaderService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _root: UrlHandlerService,
        private _http: Http,
        private _alertService: AlertService,
        private elRef: ElementRef) {

    }

    ngOnInit() {
        this.outofRange = false;
        // this.activities = new ActivityList();

        this.activity = new Activity();
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        Helpers.setLoading(true);
        this._http.get(this._root.root_url + '/activity', { headers: headers })
            .subscribe((res: Response) => {

                let r = res.json();
                this.data = r;
                this.result = r;
                Helpers.setLoading(false);

            },
            error => {
                Helpers.setLoading(false);
            }
            );

        // this.options = {
        //     // datasource definition
        //     data: {
        //         type: 'remote',
        //         source: {
        //             read: {
        //                 // sample GET method
        //                 method: 'GET',
        //                 url: this._root.root_url + '/activity',
        //                 headers: {
        //                     'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),
        //                     'Content-Type': 'application/json'
        //                 },
        //                 map: function(raw) {


        //                     var dataSet = raw;
        //                     //    // this.activities=dataSet;


        //                     //     console.log(this.activities)
        //                     if (typeof raw.data !== 'undefined') {

        //                         dataSet = raw.data;
        //                     }
        //                     return dataSet;
        //                 },
        //             },
        //         },
        //         pageSize: 10,
        //         // serverPaging: true,
        //         // serverFiltering: true,
        //         // serverSorting: true,
        //     },
        //     // layout definition
        //     layout: {

        //         scroll: false,
        //         footer: false
        //     },
        //     // column sorting
        //     // sortable: true,
        //     pagination: true,
        //     toolbar: {
        //         // toolbar items
        //         items: {
        //             // pagination
        //             pagination: {
        //                 // page size select
        //                 pageSizeSelect: [10, 20, 30, 50, 100],
        //             },
        //         },
        //     },
        //     // search: {
        //     //     input: $('#generalSearch'),
        //     // },
        //     // columns definition
        //     columns: [
        //         {
        //             field: '',
        //             title: 'S.No',
        //             sortable: false, // disable sort for this column
        //             width: 40,
        //             selector: false,
        //             textAlign: 'center',
        //             template: function(row, index, datatable) {
        //                 return index + 1;
        //             },
        //         },

        //         {
        //             field: 'athlete.first_name',
        //             title: 'Athlete',
        //             filterable: true,
        //             // sortable: 'dsc',
        //             width: 150,
        //         },
        //         {
        //             field: 'preactivity.name',
        //             title: 'Activity<small>&nbsp;</small>',
        //             filterable: true,
        //             width: 150,
        //         },
        //         {
        //             field: 'date',
        //             title: 'Date <br/><small>(yyyy-mm-dd)</small>',
        //             filterable: false,
        //             width: 100,
        //         },
        //         {
        //             field: 'weight_loss',
        //             title: this.preferredUnitID == '1' ? 'Weight Loss <br/><small>(kg)</small>' : 'Weight Loss <br/><small>(lbs)</small>',
        //             filterable: false,
        //             width: 100,
        //         },
        //         {
        //             field: 'dehydration',
        //             title: 'Dehydration %',
        //             filterable: true,
        //             // sortable: true,
        //             width: 150,

        //         },
        //         {
        //             field: 'sweatrate',
        //             title: 'Sweat Rate <br/><small>(l/hr)</small>',
        //             filterable: false,
        //             width: 100,
        //         },

        //         {
        //             field: 'Actions',
        //             width: 170,
        //             title: 'Actions',
        //             sortable: false,
        //             overflow: 'visible',

        //             template: function(row, index, datatable) {
        //                 return '\<a data-id="' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-activities-edit" title="Report" data-toggle="modal" href="#sweatrateReport" ><i class="la la-file"></i></a>\ ';


        //                 //   return '\<a data-id="' + row.id + '" data-email="' + row.email + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-reset" title="Reset Password"><i class="la la-refresh"></i></a>\
        //                 //   <a data-id="'+ row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-delete" title="Delete"><i class="la la-trash"></i></a>\
        //                 //   ';


        //             },
        //         }
        //     ],
        // }
        //console.log(this.options.data.source.read.map);
        // this.datatable = (<any>$('.m_datatable')).mDatatable(this.options);


    }



    draw() {

        jQuery('#power-gauge').children(".gauge").remove();
        console.log(this.gaugeValue);
        var self = this;
        // this.gaugeValue =0.0;
        if (this.gaugeValue > 5) {
            this.maxValue = 5;
        }
        if (this.gaugeValue <= 0) {
            this.gaugeValue = 0;
        }
        if (this.gaugeValue >= 5) {
            this.gaugeValue = 5
        }
        var gauge = function(container, configuration) {
            var config = {
                size: 710,
                clipWidth: 200,
                clipHeight: 110,
                ringInset: 20,
                ringWidth: 20,
                pointerWidth: 10,
                pointerTailLength: 5,
                pointerHeadLengthPercent: 0.9,
                minValue: 0,
                maxValue: 5,
                minAngle: -110,
                maxAngle: 110,
                transitionMs: 750,
                majorTicks: 7,
                labelFormat: d3.format('d'),
                labelInset: 5,
                arcColorFn: d3.interpolateHsl(d3.rgb('#199823'), d3.rgb('#861615'))
            };
            var range = undefined;
            var r = undefined;
            var pointerHeadLength = undefined;
            var value = 0;
            var svg = undefined;
            var arc = undefined;
            var scale = undefined;
            var ticks = undefined;
            var tickData = undefined;
            var pointer = undefined;
            var donut = d3.pie();
            function deg2rad(deg) {
                return deg * Math.PI / 180;
            }
            function newAngle(d) {
                var ratio = scale(d);
                var newAngle = config.minAngle + (ratio * range);
                return newAngle;
            }

            function configure(configuration) {
                var prop = undefined;
                for (prop in configuration) {
                    config[prop] = configuration[prop];
                }

                range = config.maxAngle - config.minAngle;
                r = config.size / 2;
                pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

                scale = d3.scaleLinear()
                    .range([0, 1])
                    .domain([config.minValue, config.maxValue]);

                ticks = scale.ticks(config.majorTicks);
                tickData = d3.range(config.majorTicks).map(function() { return 1 / config.majorTicks; });

                arc = d3.arc()
                    .innerRadius(r - config.ringWidth - config.ringInset)
                    .outerRadius(r - config.ringInset)
                    .startAngle(function(d, i) {
                        var ratio = d * i;
                        return deg2rad(config.minAngle + (ratio * range));
                    })
                    .endAngle(function(d, i) {
                        var ratio = d * (i + 1);
                        return deg2rad(config.minAngle + (ratio * range));
                    });

            }
            self.gaugemap.configure = configure;

            function centerTranslation() {
                return 'translate(' + r + ',' + r + ')';
            }

            function isRendered() {
                return (svg !== undefined);
            }
            self.gaugemap.isRendered = isRendered;

            function render(newValue) {
                svg = d3.select(container)
                    .append('svg:svg')
                    .attr('class', 'gauge')
                    .attr('width', config.clipWidth)
                    .attr('height', config.clipHeight);


                var centerTx = centerTranslation();

                var arcs = svg.append('g')
                    .attr('class', 'arc')
                    .attr('transform', centerTx);

                arcs.selectAll('path')
                    .data(tickData)
                    .enter().append('path')
                    .attr('fill', function(d, i) {
                        return config.arcColorFn(d * i);
                    })
                    .attr('d', arc);

                var lg = svg.append('g')
                    .attr('class', 'label')
                    .attr('transform', centerTx);
                lg.selectAll('text')
                    .data(ticks)
                    .enter().append('text')
                    .attr('transform', function(d) {
                        var ratio = scale(d);
                        var newAngle = config.minAngle + (ratio * range);
                        return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
                    })
                    .text(config.labelFormat);

                var lineData = [[config.pointerWidth / 2, 0],
                [0, -pointerHeadLength],
                [-(config.pointerWidth / 2), 0],
                [0, config.pointerTailLength],
                [config.pointerWidth / 2, 0]];
                var pointerLine = d3.line().curve(d3.curveLinear)
                var pg = svg.append('g').data([lineData])
                    .attr('class', 'pointer')
                    .attr('transform', centerTx);

                pointer = pg.append('path')
                    .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
                    .attr('transform', 'rotate(' + config.minAngle + ')');

                update(newValue === undefined ? 0 : newValue);
            }
            self.gaugemap.render = render;
            function update(newValue, newConfiguration?) {
                if (newConfiguration !== undefined) {
                    configure(newConfiguration);
                }
                var ratio = scale(newValue);
                var newAngle = config.minAngle + (ratio * range);
                pointer.transition()
                    .duration(config.transitionMs)
                    .ease(d3.easeElastic)
                    .attr('transform', 'rotate(' + newAngle + ')');
            }
            self.gaugemap.update = update;

            configure(configuration);

            return self.gaugemap;
        };

        var powerGauge = gauge('#power-gauge', {
            size: 300,
            clipWidth: 300,
            // clipHeight: 300,
            clipHeight: 215,
            ringWidth: 60,
            maxValue: this.maxValue,
            transitionMs: 4000,
        });
        powerGauge.render(this.gaugeValue);
        this.outofRange = true;

    }

    sweatrate() {
        console.log(this.activities);
    }

    ngAfterViewInit() {


        Helpers.setLoading(true);

        let _self = this;
        let deleteUser = this;
        let root_url: string = this._root.root_url;


        // this.datatable.on('m-datatable--on-layout-updated', function(e) {
        //     $(_self.elRef.nativeElement).find('.m-portlet__nav-link.btn.m-btn.m-btn--hover-primary.m-btn--icon.m-btn--icon-only.m-btn--pill.btn-activities-edit').click(function() {
        //         let custId = $(this).data('id');

        //         console.log('hi ' + custId);

        //         _self.result.forEach(element => {
        //             if (element.id == custId) {
        //                 _self.activity = element;
        //                 _self.gaugeValue = element.dehydration;
        //                 _self.draw();



        //             }
        //         });
        //         // let headers = new Headers();
        //         // let currentUser = localStorage.getItem('currentUser');
        //         // headers.append('Authorization', 'Bearer ' + currentUser);
        //         // headers.append('Content-Type', 'application/json');
        //         // return _self._http.get(root_url + '/activity/' + custId, { headers: headers })
        //         //     .subscribe((res: Response) => {
        //         //         _self.activities =res.json();
        //         //         // _self._toastrService.Warning("The Activity Has been Deleted Successfull", "Delete Activity");
        //         //        // _self._router.navigateByUrl('/refresh-activity');
        //         //     });

        //     });

        // });

        // this.datatable.on('m-datatable--on-layout-updated', function(e) {
        //     $(_self.elRef.nativeElement).find('.m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-activities-edit').click(function() {
        //         let custId = $(this).data('id');

        //         let headers = new Headers();
        //         let currentUser = localStorage.getItem('currentUser');
        //         headers.append('Authorization', 'Bearer ' + currentUser);
        //         headers.append('Content-Type', 'application/json');
        //         return _self._http.get(root_url + '/activity/' + custId, { headers: headers })
        //             .subscribe((res: Response) => {
        //                 console.log(res);
        //                 // _self._toastrService.Warning("The Activity Has been Deleted Successfull", "Delete Activity");
        //                 // _self._router.navigateByUrl('/refresh-activity');
        //             });
        //     });


        // });

    }

    generateReportDraw(id) {
        let custId = id;
        console.log('hi ' + custId);
        this.result.forEach(element => {
            if (element.id == custId) {
                this.activity = element;
                this.gaugeValue = element.dehydration;
                this.draw();

            }
        });
    }


}
