import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
    Renderer2,
    ViewEncapsulation,
    AfterViewInit,
    ElementRef, EventEmitter, Input, Output,
    OnChanges, SimpleChanges, SimpleChange
} from '@angular/core';
import { Utils } from '../../utils/utile.service';

import * as d3g from "d3";
declare var d3: any;
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import { AmazingTimePickerService } from 'amazing-time-picker';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';
import { delay } from 'rxjs/operators';
import { first } from 'rxjs/operator/first';
import { Subscription } from 'rxjs/Subscription';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { UrlHandlerService } from '../../../../../_services/url-handler.service';
import { ToastrService } from '../../../../../_services/toastr.service';
import { UserService, AuthenticationService, AlertService } from '../../../../../auth/_services';
import { BackHighlightDirective } from './directives/back-highlight.directive';

// import { NouisliderModule } from 'ng2-nouislider';
import { ActivityList } from './models/activityList';
import { Activity } from './models/activity';
import { Helpers } from '../../../../../helpers';
import { PreActivity } from './models/pre_activity';
import { event } from 'd3';
declare var jquery: any;
declare var $: any;
declare var toastr: any;
declare let swal: any;


@Component({
    selector: 'app-add-activity',
    templateUrl: './add-activity.component.html',
    styleUrls: ['./add-activity.component.css']

})

export class AddActivityComponent implements OnInit, AfterViewInit {
    d3;
    isUpdateAthlete: boolean; isUpdateAthletePost: boolean; isUpdateActivity: boolean; isUpdateAthletesList: boolean;
    initCheck: boolean; isgenReport: boolean; outofRange: boolean; isSwalAlert: boolean;
    // @ViewChild('form') ngForm: NgForm;
    // @ViewChild('myForm') ngForm;

    // @Input() pre_activity;
    notifier: Observable<any>;
    sortBy = "asc";
    sortOrder = "first_name";
    @ViewChild(BackHighlightDirective) highLight: any;
    @ViewChild('preActivity') preActivity: ElementRef;
    custId: any;
    public disabled: boolean = false;
    public someValue: number = 5;
    public someMin: number = -10;
    public someMax: number = 10;
    preferredUnitID: any = localStorage.getItem('preferedUnit');

    sports: any[] = [];
    preActWithCloth = true;
    sweatrate: any;
    weight_loss: any;
    gaugemap: any = {};
    model: any = {};
    toggleActivityID: any;
    listPreActivities: any[] = []; // List of Pre-Activities for Local Storage
    togglePostActivityID: any;
    toggleCalcActivityID: any;
    configure = {};

    activityName: any;
    preAthleteFName: any;
    preAthleteLName: any;
    postAthleteFName: any;
    postAthleteLName: any;
    calAthleteFName: any;
    calAthleteLName: any;
    profilePic: any;
    preactivity: any = {
        withoutclothe: String,
        withclothe: String,
        clothing: String,
        cloth_description: String
    };
    postactivity: any = {
        athleteStatus: Boolean,
        postwithoutclothe: String,
        postwithclothe: String,
        total_fluid: String,
        gels_solid: String,
        urination: String,
        duration: String,
        distance: String,
        average_power: String,
        load: String,
        internal_load_RPE: String,
        external_load_RPE: String,
        active_precent: String,
        hydration_notes: String
    };
    backgroundColors: String;
    athletesSelected = [];
    selectedAthleteList: any[] = [];
    preActivityID: any = [];
    preAthleteId: any;
    maxValue = 5;
    gaugeValue: any;
    loading = false;
    datatable: any;
    // noUiSlider: any;
    secilenler = [];
    selected: any;
    swimming = false;
    activities = new ActivityList();
    activity = new Activity();
    pre_activity = new PreActivity();
    currentActivityId: Number;
    isLoading: Boolean;
    isEdit: Boolean;
    t: any;
    currentState: Number;
    lastState: Number;
    data;

    constructor(private _router: Router,
        private _http: Http,
        private renderer: Renderer2,
        private _script: ScriptLoaderService,
        private _root: UrlHandlerService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private elRef: ElementRef,
        private atp: AmazingTimePickerService,
        private _toastrService: ToastrService,
        private util: Utils,
        private cfr: ComponentFactoryResolver,
    ) {


        this._route.params.subscribe(params => {
            this.custId = params.custId;
            this.activitiesList();
        });
        this.currentState = this.lastState = 0;
        this.currentActivityId = 0;
        this.selectedAthleteList = [];
        if (this.preferredUnitID == null) {
            this.preferredUnitID = '1';
        }



        // console.log("Preferred Unit :" + this.preferredUnitID);
        this.postactivity.athleteStatus = false;
        let _self = this;
        this.getSports();
        this.isLoading = true;
    }

    open() {
        const amazingTimePicker = this.atp.open();
        amazingTimePicker.afterClose().subscribe(time => {
        });
    }
    selectdrop(args) {
        if (args.target.value == "2db60763-4366-4821-9632-3fb0c7951e4a") {
            this.swimming = true;
        }
        else {
            this.swimming = false;
            this.pre_activity.water_temperature = null;
        }
    }
    cancelActivity() {
        this._router.navigate(['/activity-management']);
    }

    log(a) {
        console.log('from log' + a);
    }
    acclimatizedSwitch(event) {
        this.activity.acclimatized = event.target.checked;
    }
    ngOnInit() {
        this.isUpdateAthletePost = false;
        this.isUpdateAthlete = false;
        this.isUpdateActivity = false;
        this.isUpdateAthletesList = false;
        this.isgenReport = false;
        this.outofRange = false;
        this.isSwalAlert = true;
        //  setTimeout(() => {
        //     this.outofRange=true;
        //  }, 5000);

        // let secilenler = [];
        this._route.params.subscribe(params => {
            this.custId = params.custId;
            this.activitiesList();

        });

        if (this.custId != undefined) {
            let headers = new Headers();
            let currentUser = localStorage.getItem('currentUser');
            headers.append('Authorization', 'Bearer ' + currentUser);
            headers.append('Content-Type', 'application/json');
            this._http.get(this._root.root_url + '/preactivity_athletes/' + this.custId, { headers: headers })
                .subscribe((res: Response) => {
                    this.secilenler = res.json().ids;
                    // this.secilenler = this.athletesSelected;
                    this.isEdit = true;
                    let IntialTempObjAthletes = this.secilenler;
                    localStorage.setItem("names", JSON.stringify(this.secilenler));
                    this.initCheckAthletes = true;
                    // console.log(this.athletesSelected);

                });
        }




        $('#m_timepicker_1, #m_timepicker_1_modal').timepicker({
            showSeconds: true,
            showMeridian: true,

        });

        // $("#m_inputmask_1").inputmask("mm/dd/yyyy", {
        //     autoUnmask: true
        // });
        // $('#exampleTextarea').click(function () {
        //    // console.log("Hello");
        // });

        this.preactivity.withclothe = "";
        this.preactivity.withoutclothe = "";
        this.preactivity.cloth_description = "";
        this.postactivity.postwithoutclothe = "";
        this.postactivity.postwithclothe = "";
        this.postactivity.total_fluid = "";
        this.postactivity.gels_solid = "";
        this.postactivity.urination = "";
        this.postactivity.duration = "";
        this.postactivity.distance = "";
        this.postactivity.average_power = "";
        this.postactivity.load = "0";
        this.postactivity.hydration_notes = "";
        this.postactivity.internal_load_PRE = "0";
        this.postactivity.active_precent = "";
        this.postactivity.external = "";


        // let headers = new Headers();
        // let currentUser = localStorage.getItem('currentUser');
        // headers.append('Authorization', 'Bearer ' + currentUser);
        // headers.append('Content-Type', 'application/json');
        // return this._http.get(this._root.root_url + '/athletes', { headers: headers })
        //     .subscribe((res: Response) => {
        //         this.data = res.json();
        //         // listSports.forEach(element => {
        //         //     let name = element.sport_name;
        //         //     let id = element.id;
        //         //     this.sports.push({
        //         //         id: id,
        //         //         name: name
        //         //     });
        //         // });
        //     });

        this.listOfAthletes();
        // $('.chk').change(function(){
        //     alert('hi');
        // });
        $('#AthleteSelectAll').change(function () {

            if (this.checked) {
                $('.chk').each(function (i, e) {
                    $(e).attr('checked', true);
                });
            } else {
                $('.chk').each(function (i, e) {
                    $(e).attr('checked', false);
                });
            }



        });
        // $('input:checkbox').click(function(){

        //     alert("hi");

        //     // if(!this.checked &&  !(this.id =='AthleteSelectAll')){
        //     //     $('#AthleteSelectAll').attr("checked",false)
        //     // }

        // });
        // this.options = {
        //     data: {
        //         type: 'remote',
        //         source: {
        //             read: {
        //                 method: 'GET',
        //                 url: this._root.root_url + '/athletes',
        //                 headers: {
        //                     'Authorization': 'Bearer ' + localStorage.getItem('currentUser'),
        //                     'Content-Type': 'application/json'
        //                 },
        //                 map: function (raw) {
        //                   //  console.log(raw);
        //                     var dataSet = raw;
        //                     if (typeof raw.data !== 'undefined') {
        //                         dataSet = raw.data;
        //                     }
        //                     return dataSet;
        //                 },
        //             },
        //         },
        //         pageSize: 100,
        //     },
        //     layout: {
        //         scroll: false,
        //         footer: false
        //     },
        //     sortable: true,
        //     pagination: false,
        //     toolbar: {
        //         items: {
        //             pagination: {
        //                 pageSizeSelect: [10, 20, 30, 50],
        //             },
        //         },
        //     },
        //     search: {
        //         input: $('#generalSearch'),
        //     },
        //     columns: [
        //         {
        //             field: 'id',
        //             title: '#',
        //             sortable: false, // disable sort for this column
        //             width: 40,
        //             textAlign: 'center',
        //             selector: { class: 'm-checkbox--solid m-checkbox--brand' }
        //         },
        //         {
        //             field: 'first_name',
        //             title: 'First Name',
        //             filterable: true,
        //             width: 150,
        //         },
        //         {
        //             field: 'last_name',
        //             title: 'Last Name',
        //             filterable: true,
        //             sortable: 'asc',
        //             width: 150,
        //         },
        //         {
        //             field: 'sport.sport_name',
        //             title: 'Primary Sport',
        //             filterable: true,
        //             width: 150,
        //         },
        //         {
        //             field: 'is_team_nl',
        //             title: 'Team NL',
        //             filterable: true,
        //             sortable: true,
        //             width: 150,
        //             template: function (row, index, datatable) {

        //                 var dropup = (row.is_team_nl) == true ? 'Active' : 'Inactive';
        //                 if (dropup == 'Active') {
        //                     return '<span><img style="margin-left:10px;height:50px;" src="./assets/images/team_nl.jpg" /></span>';
        //                 }
        //                 else if (dropup == 'Inactive') {
        //                     return '<span style="margin-left: 25px;">-</span>';
        //                 }
        //             },
        //         },
        //     ],
        // };

        // this.datatable = (<any>$('.m_datatable')).mDatatable(this.options);



        // $(this.datatable).on('m-datatable--on-check', function (e, args) {
        //     // let id = parseInt(args);

        //     // let v = $.inArray(id, this.secilenler);
        //     // if (v == -1) {
        //     //     this.secilenler.push(id);
        //     //     // this.temp.add(id,"apple");
        // //     // }
        // //     let a =[];
        // //     jQuery('input[type="checkbox"]:checked').each(function (i,e) {
        // //         a.push(parseInt($(e).val()));
        // //     });

        // //     this.t=a;
        // //     this.t.push(11);
        // //    console.log( this.athletesSelected);
        // });

        // $(this.datatable).on('m-datatable--on-uncheck', function (e, args) {
        //     // var i = $.inArray(parseInt(args), this.secilenler);
        //     // if (i !== -1) {
        //     //     this.secilenler.splice(i, 1);
        //     // }

        // //     let a =[];
        // //     jQuery('input[type="checkbox"]:checked').each(function (i,e) {
        // //         a.push(parseInt($(e).val()));
        // //     });

        // //    this.t=a;           
        //     //console.log(selected);
        // });

        // $(this.datatable).on('m-datatable--on-layout-updated', function (e, args) {
        //     // for (let arr = 0; arr < this.secilenler.length; arr++) {
        //     // }
        // });

        this.t = this.athletesSelected;
        console.log(this.t);
    }

    draw(i) {

        jQuery('#power-gauge-' + i).children(".gauge").remove();

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
        var gauge = function (container, configuration) {
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
                tickData = d3.range(config.majorTicks).map(function () { return 1 / config.majorTicks; });

                arc = d3.arc()
                    .innerRadius(r - config.ringWidth - config.ringInset)
                    .outerRadius(r - config.ringInset)
                    .startAngle(function (d, i) {
                        var ratio = d * i;
                        return deg2rad(config.minAngle + (ratio * range));
                    })
                    .endAngle(function (d, i) {
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
                    .attr('fill', function (d, i) {
                        return config.arcColorFn(d * i);
                    })
                    .attr('d', arc);

                var lg = svg.append('g')
                    .attr('class', 'label')
                    .attr('transform', centerTx);
                lg.selectAll('text')
                    .data(ticks)
                    .enter().append('text')
                    .attr('transform', function (d) {
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

        var powerGauge = gauge('#power-gauge-' + i, {
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

    // compareSports(c1:)

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
    getColors() {
        let i = 0;
        if (i = 0) {
            return this.backgroundColors = '#f2f2f2';
        }
        else {
            return this.backgroundColors = 'orange';
        }
    }
    ngAfterContentInit() {


    }


    modelChangedActivity(newObj) {
        this.isUpdateActivity = true;
    }

    item1; item2; changes1; changes2;
    addActivity(myForm) {
        if (myForm.form.valid) {

            // this.lastState = this.currentState;
            // this.currentState = 1;
            this.pre_activity;
            // console.log(this.activity)
            let _self = this;
            let sa = [];
            $.each(this.selectedAthleteList, function (i, e) {
                sa.push(e.athleteId);
            });
            if (this.isEdit) {
                if (this.secilenler != null) {

                    sa = this.secilenler;

                }
            }
            jQuery('input[type="checkbox"]').each(function (i, e) {
                if (sa.length > 0) {
                    if ($.inArray($(this).val(), sa) !== -1) {
                        $(this).attr('checked', true);
                    } else {
                        $(this).attr('checked', false);
                    }
                }
            });


            let headers = new Headers();
            let currentUser = localStorage.getItem('currentUser');
            headers.append('Authorization', 'Bearer ' + currentUser);
            headers.append('Content-Type', 'application/json');


            let initPre_activityID = localStorage.getItem('preActivityID');
            this.pre_activity.pre_activity_id = initPre_activityID;
            // let tempObj = this.pre_activity;
            // localStorage.setItem('key', JSON.stringify(tempObj));
            Helpers.setLoading(true);
            return _self._http.post(this._root.root_url + '/activity', this.pre_activity, { headers: headers })
                .subscribe((res: Response) => {
                    let IntialTempObj = null;
                    Helpers.setLoading(false);
                    localStorage.setItem('key1', JSON.stringify(IntialTempObj));
                    this.initCheck = false;
                    let preActivityRes = res.json();
                    let activityIDS = preActivityRes.pre_activity_id;
                    localStorage.setItem('preActivityID', activityIDS);
                    // if (this.lastState <= this.currentState) {
                    if (this.isUpdateActivity == true) {
                        this._toastrService.Success(preActivityRes.message);
                        this.isUpdateActivity = false;

                    }
                    if (this.isgenReport == true) {
                        this.saveFinalPostActivity(this.activity);
                    }


                    // }

                }, error => {
                    Helpers.setLoading(false);
                });
        }
    }


    addActivityHeaderAndAthlete(myForm) {
        if (myForm.form.valid) {
            // this.lastState = this.currentState;
            // this.currentState = 1;
            this.pre_activity;
            // console.log(this.activity)
            let _self = this;
            let sa = [];
            $.each(this.selectedAthleteList, function (i, e) {
                sa.push(e.athleteId);
            });
            if (this.isEdit) {
                if (this.secilenler != null) {

                    sa = this.secilenler;

                }
            }

            jQuery('input[type="checkbox"]').each(function (i, e) {
                if (sa.length > 0) {
                    if ($.inArray($(this).val(), sa) !== -1) {
                        $(this).attr('checked', true);
                    } else {
                        $(this).attr('checked', false);
                    }
                }
            });



            let headers = new Headers();
            let currentUser = localStorage.getItem('currentUser');
            headers.append('Authorization', 'Bearer ' + currentUser);
            headers.append('Content-Type', 'application/json');


            let initPre_activityID = localStorage.getItem('preActivityID');
            this.pre_activity.pre_activity_id = initPre_activityID;
            // let tempObj = this.pre_activity;
            // localStorage.setItem('key', JSON.stringify(tempObj));
            Helpers.setLoading(true);
            return _self._http.post(this._root.root_url + '/activity', this.pre_activity, { headers: headers })
                .subscribe((res: Response) => {
                    let IntialTempObj = null;
                    Helpers.setLoading(false);
                    localStorage.setItem('key1', JSON.stringify(IntialTempObj));
                    this.initCheck = false;
                    let preActivityRes = res.json();
                    let activityIDS = preActivityRes.pre_activity_id;
                    localStorage.setItem('preActivityID', activityIDS);
                    // if (this.lastState <= this.currentState) {

                    if (this.isgenReport == true) {
                        this.addAthletes();
                    } else {
                        this.addAthletes();
                    }


                    // }

                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    addActivityHeader(myForm) {
        if (myForm.form.valid) {

            // this.lastState = this.currentState;
            // this.currentState = 1;
            this.pre_activity;
            // console.log(this.activity)
            let _self = this;
            let sa = [];
            $.each(this.selectedAthleteList, function (i, e) {
                sa.push(e.athleteId);
            });
            if (this.isEdit) {
                if (this.secilenler != null) {

                    sa = this.secilenler;

                }
            }

            jQuery('input[type="checkbox"]').each(function (i, e) {
                if (sa.length > 0) {
                    if ($.inArray($(this).val(), sa) !== -1) {
                        $(this).attr('checked', true);
                    } else {
                        $(this).attr('checked', false);
                    }
                }
            });



            let headers = new Headers();
            let currentUser = localStorage.getItem('currentUser');
            headers.append('Authorization', 'Bearer ' + currentUser);
            headers.append('Content-Type', 'application/json');


            let initPre_activityID = localStorage.getItem('preActivityID');
            this.pre_activity.pre_activity_id = initPre_activityID;
            // let tempObj = this.pre_activity;
            // localStorage.setItem('key', JSON.stringify(tempObj));
            Helpers.setLoading(true);
            return _self._http.post(this._root.root_url + '/activity', this.pre_activity, { headers: headers })
                .subscribe((res: Response) => {
                    let IntialTempObj = null;
                    Helpers.setLoading(false);
                    localStorage.setItem('key1', JSON.stringify(IntialTempObj));
                    this.initCheck = false;
                    let preActivityRes = res.json();
                    let activityIDS = preActivityRes.pre_activity_id;
                    localStorage.setItem('preActivityID', activityIDS);
                    // if (this.lastState <= this.currentState) {
                    if (this.isUpdateActivity == true) {
                        this._toastrService.Success(preActivityRes.message);
                        this.isUpdateActivity = false;
                        if (this.isgenReport == true) {
                            this.saveFinalPostActivity(this.activity);
                        }
                    }

                    // }

                },
                error => {
                    Helpers.setLoading(false);
                });
        }
    }

    getTime(v) {

    }
    // event;

    InitialState(myForm, event) {
        if ((event.currentTarget.dataset.wizard == "1") || (event.currentTarget.dataset.wizard == "2")) {
            this.isSwalAlert = false;
        } else {
            this.isSwalAlert = true;
        }
        this.outofRange = false;
        // this.lastState = this.currentState;
        if (this.isUpdateActivity == true) {
            this.addActivityHeader(myForm);


        } //addactivity
        else if (this.isUpdateAthletesList == true) {
            this.addAthletes() //addathletes
        }

        else if (this.isUpdateAthlete == true) {
            this.saveFinalPreActivity(this.activity)  //preactivity
        }
        else if (this.isUpdateAthletePost == true) {
            this.saveFinalPostActivity(this.activity) //postactivity
        }
        else {
            this.addActivityHeaderAndAthlete(myForm);
        }


    }


    isgenReports(myForm, event) {
        if ((event.currentTarget.dataset.wizard == "1") || (event.currentTarget.dataset.wizard == "2")) {
            this.isSwalAlert = false;
        } else {
            this.isSwalAlert = true;
        }
        this.outofRange = false;
        this.isgenReport = true;
        if (this.isUpdateActivity == true) {
            this.addActivityHeader(myForm);


        } //addactivity
        else if (this.isUpdateAthletesList == true) {
            this.addAthletes(); //addathletes
        }

        else if (this.isUpdateAthlete == true) {
            this.saveFinalPreActivity(this.activity)  //preactivity
        }
        else if (this.isUpdateAthletePost == true) {
            this.saveFinalPostActivity(this.activity) //postactivity
        }
        else {
            this.addActivityHeaderAndAthlete(myForm);
        }

    }

    modelChangedAthletesList(newObj) {
        this.isUpdateAthletesList = true;
    }

    itemAthletes1; itemAthletes2; changesAthletes1; changesAthletes2; cmpActivites;
    initialCheckedAthlete; newCheckedAthlete;
    addAthletes() {
        // this.lastState = this.currentState;
        // this.currentState = 2;        
        this.selectedAthleteList = [];
        let _self = this;
        // if (_self.activities != null) {
        //     this.initialCheckedAthlete = true;
        // }
        let a = [];
        jQuery('input[type="checkbox"]:checked').each(function (i, e) {
            a.push($(e).val());
        });


        let pre_activity_id = localStorage.getItem('preActivityID'); // Getting Pre_activity ID from Wizard 1
        let athletes = a; // Getting List of Athletes as Array


        let selectedAthletesLst = { pre_activity_id, athletes }; // Prepare for API Request(Save the selected_Athletes Wizard 2)
        var preAthleteId; // Getting single Athlete ID from the response


        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        let activityIds;
        let athleteIds;
        let athleteProfilePics;


        let responseSize = 0;
        this.isLoading = true;
        Helpers.setLoading(true);
        let tempObjAthletes = selectedAthletesLst.athletes;
        if (tempObjAthletes.length == 0) {
            if (this.isSwalAlert == true) {
                swal('Athlete not selected!');
            } else {

            }
            // this._toastrService.Warning('Athlete not selected');
        } else {
            Helpers.setLoading(true);
            localStorage.setItem("namesNew", JSON.stringify(tempObjAthletes));
            _self._http.post(this._root.root_url + '/select_athletes', selectedAthletesLst, { headers: headers })
                .subscribe((res: Response) => {
                    this.activities = res.json();


                    let selectedSize = this.activities.success_activities.length;

                    this.activities.success_activities.forEach(element => {
                        _self._http.get(this._root.root_url + '/athletes/' + element.athlete_id, { headers: headers })
                            .subscribe((res: Response) => {
                                Helpers.setLoading(false);
                                let ath = res.json().athlete;
                                element.profile_picture = ath.profile_picture;
                                element.athlete_name = ath.first_name + ' ' + ath.last_name;
                                element.athlete = ath;
                                responseSize = responseSize + 1;
                                if (responseSize == selectedSize) {
                                    this.sortAthelets(this.activities);
                                    // console.log(this.currentActivityId);
                                    let z = false;

                                    this.activities.success_activities.forEach(e => {
                                        if (e.id == this.currentActivityId) {
                                            z = true;
                                            return false;
                                        }
                                    });
                                    if (!z || this.currentActivityId == 0) {
                                        if (this.activities != null) {
                                            this.currentActivityId = this.activities.success_activities[0].id;
                                        }
                                    }
                                    if (this.isgenReport == true) {
                                        this.saveFinalPostActivity(this.activities);
                                    }
                                    this.isLoading = false;
                                    Helpers.setLoading(false);
                                }

                            },
                            error => {
                                Helpers.setLoading(false);
                            });
                    });



                },
                error => {
                    Helpers.setLoading(false);
                });


            // if (this.lastState <= this.currentState) {
            Helpers.setLoading(false);
            if (this.isUpdateAthletesList == true) {
                this._toastrService.Success('Athlete has been updated successfully.', 'Select Athlete');
                this.isUpdateAthletesList = false;
            }


            // }
        }
        Helpers.setLoading(false);

    }
    modelChanged(newObj) {
        this.isUpdateAthlete = true;
    }


    putPreActivity() {

        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        let _self = this;
        let saveAct = new Activity();
        this.activities.success_activities.forEach(element => {
            if (element.id == this.currentActivityId) {
                saveAct = element;
            }
        });
        let preactivity_id = saveAct.preactivity_id;
        let activities = [saveAct];
        let activitie = { activities, preactivity_id };

        _self._http.put(this._root.root_url + '/pre_activity', activitie, { headers: headers })
            .subscribe((res: Response) => {
                Helpers.setLoading(false);
                // if (this.lastState <= this.currentState) {
                if (this.isUpdateAthlete == true) {
                    _self._toastrService.Success('Pre Activity has been added Successfully', 'Pre Activity');
                    Helpers.setLoading(false);
                    this.isUpdateAthlete = false;
                }
                if (this.isgenReport == true) {
                    this.saveFinalPostActivity(this.activity);
                }
                // }
            },
            error => {
                this.isUpdateAthlete = false;
            })

    }
    savePreActivity(activityid, athleteID, i, value) {
        if (this.isUpdateAthlete == true) {
            Helpers.setLoading(true);
        }
        // this.lastState = this.currentState;
        // this.currentState = 3;
        this.putPreActivity();
        this.currentActivityId = activityid;
        let individualActivityID = value.srcElement.getAttribute('data-athlete-id');
        let id = this.toggleActivityID;
        this.toggleActivityID = activityid;

    }

    saveFinalPreActivity(value) {
        if (this.isUpdateAthlete == true) {
            Helpers.setLoading(true);
        }
        // this.lastState = this.currentState;
        // this.currentState = 3;
        this.putPreActivity();
        this.toggleActivityID = this.currentActivityId;

        // if(this.lastState >= this.currentState){
        // this._toastrService.Success('Pre Activity has been added successfully', 'Pre Activity');
        // }
    }

    savePostActivity(activityid, athleteID, i, value) {
        if (this.isUpdateAthletePost == true) {
            Helpers.setLoading(true);
        }
        this.putPostActivity();
        this.currentActivityId = activityid;
        let individualActivityID = value.srcElement.getAttribute('data-athlete-id');
        let id = this.toggleActivityID;
        this.toggleActivityID = activityid;
        this.togglePostActivityID = activityid;
    }
    str;
    modelChangedPost(newObj) {
        this.activities.success_activities.forEach(element => {
            if (element.id == this.currentActivityId) {
                // var durationFinal = newObj.match(/.{1,2}/g);
                // newObj= durationFinal.join(":"); //returns 123-456-789
                if (element.duration != null) {
                    if (element.duration.length > 2) {
                        this.str = element.duration.replace(/[:]/g, "");
                    } else {
                        this.str = element.duration;
                    }
                }
                if (newObj == this.str) {
                    this.isUpdateAthletePost = false;
                } else {
                    this.isUpdateAthletePost = true;
                }
            }
        });
    }

    putPostActivity() {
        let currentUser = localStorage.getItem('currentUser');
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        let saveAct = new Activity();
        let _self = this;
        if (this.activities != null) {
            this.activities.success_activities.forEach(element => {
                if (element.id == this.currentActivityId) {
                    if ((element.duration == "1") || (element.duration == "01")) {
                        element.duration = "010000"
                    } else if ((element.duration == "2") || (element.duration == "02")) {
                        element.duration = "020000"
                    } else if ((element.duration == "3") || (element.duration == "03")) {
                        element.duration = "030000"
                    } else if ((element.duration == "4") || (element.duration == "04")) {
                        element.duration = "040000"
                    }
                    else if ((element.duration == "5") || (element.duration == "05")) {
                        element.duration = "050000"
                    }
                    else if ((element.duration == "6") || (element.duration == "06")) {
                        element.duration = "060000"
                    }
                    else if ((element.duration == "7") || (element.duration == "07")) {
                        element.duration = "070000"
                    }
                    else if ((element.duration == "8") || (element.duration == "08")) {
                        element.duration = "080000"
                    }
                    else if ((element.duration == "9") || (element.duration == "09")) {
                        element.duration = "090000"
                    }
                    if (element.duration != null) {
                        if (element.duration.length == 2) {
                            element.duration = element.duration + "0000"
                        }
                        else if (element.duration.length == 3) {
                            element.duration = element.duration + "000"
                        }
                        else if (element.duration.length == 4) {
                            element.duration = element.duration + "00"
                        }
                        else if (element.duration.length == 5) {
                            element.duration = element.duration + "0"
                        }
                    }
                    saveAct = element;

                }
            });
        }

        let preactivity_id = saveAct.preactivity_id;
        let activities = [saveAct];
        let activitie = { activities, preactivity_id };
        _self._http.put(this._root.root_url + '/post_activity', activitie, { headers: headers })
            .subscribe((res: Response) => {
                // Helpers.setLoading(false);
                saveAct = res.json();
                var index = 0;
                // Helpers.setLoading(false);
                this.activities.success_activities.forEach(element => {
                    if (element.id == saveAct.id) {

                        element.sweatrate = saveAct.sweatrate;
                        this.gaugeValue = element.dehydration = saveAct.dehydration;
                        element.weight_loss = saveAct.weight_loss;
                        // Helpers.setLoading(false);

                    }

                });
                this.activities.success_activities.forEach(element => {
                    this.gaugeValue = element.dehydration;
                    this.draw(index);
                    index = index + 1;

                });
                if (this.isUpdateAthletePost == true) {

                    _self._toastrService.Success('Post Activity has been added Successfully', 'Post Activity');
                    this.isUpdateAthletePost = false;
                }
                Helpers.setLoading(false);
                if (this.lastState <= this.currentState) {
                    Helpers.setLoading(false);
                    // if (this.isUpdateAthletePost == true) {

                    //     _self._toastrService.Success('Post Activity has been added Successfully', 'Post Activity');
                    //     this.isUpdateAthletePost = false;
                    // }
                }
            }, error => {
                // Helpers.setLoading(false);
            })

    }
    saveFinalPostActivity(value) {
        if (this.isgenReport == true) {
            this.isgenReport = false;
        }
        if (this.isUpdateAthletePost == true) {
            Helpers.setLoading(true);
        }
        this.lastState = this.currentState;
        this.currentState = 4;
        this.putPostActivity();
        this.toggleActivityID = this.currentActivityId;
    }

    calculateSweatrate(activityid, athleteID, i, value) {
        this.currentActivityId = activityid;
        let individualActivityID = value.srcElement.getAttribute('data-athlete-id');
        let id = this.toggleActivityID;
        this.toggleActivityID = activityid;

        // if( this.currentActivityId!=activityid){
        //     this.draw();
        // }


        // this.activities.success_activities.forEach(element => {
        //     if(element.id==this.currentActivityId){            
        //     this.gaugeValue= element.dehydration;
        //     this.draw(i);

        //     }

        // });



        //this.putPostActivity();
        // this.activities.success_activities.forEach(element => {
        //     if(element.id==activityid){
        //     //console.log(element);
        //     }
        // });
    }
    send_report(value) {

        let currentUser = localStorage.getItem('currentUser');
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        let _self = this;
        Helpers.setLoading(true);
        _self._http.get(this._root.root_url + '/activity_report/' + this.currentActivityId, { headers: headers })
            .subscribe((res: Response) => {
                let athlete = res.json();
                let reportMsg= "Hello"+' '+ athlete.first_name;
                toastr.success('Activity report sent successfully', reportMsg, {timeOut: 5000})
                // _self._toastrService.Success(' Activity report sent successfully', 'Hello ' + athlete.first_name);                
                // _self._toastrService.Success(' Activity report sent successfully', 'Hello ' + );
                Helpers.setLoading(false);
            },
            error => {
                Helpers.setLoading(false);
            });

    }

    ngAfterViewInit() {
        this._script.load('app-add-activity', 'assets/demo/default/custom/components/forms/widgets/bootstrap-timepicker.js');

        this._script.loadScripts('app-add-activity', ['assets/demo/default/custom/components/forms/wizard/wizard.js']);
        // this._script.loadScripts('app-add-activity', ['assets/demo/default/custom/components/forms/widgets/nouislider.js']);
        this._script.loadScripts('app-add-activity', ['assets/demo/default/custom/components/forms/widgets/bootstrap-timepicker.js']);
        this._script.loadScripts('app-add-activity', ['assets/demo/default/custom/components/forms/widgets/input-mask.js']);
        this._script.loadScripts('app-add-activity', ['assets/demo/default/custom/components/base/sweetalert2.js']);


        let _self = this;
        let deleteUser = this;
        let root_url: string = this._root.root_url;

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "1000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };


    }


    sortAthelets(tempActivities) {
        // tempActivities.success_activities.sort(function(act1,act2){
        //     if(act1.athlete.last_name.charCodeAt(0)>act2.athlete.last_name.charCodeAt(0))return 1;
        //     if(act1.athlete.last_name.charCodeAt(0)<act2.athlete.last_name.charCodeAt(0))return -1;
        //     return 0;
        // });

        tempActivities.success_activities.sort(function (a, b) {
            if (a.athlete != null || b.athlete != null) {
                var act1 = a.athlete.last_name, act2 = b.athlete.last_name;
            }
            if (act1 == act2) return 0;
            return act1 > act2 ? 1 : -1;

        });
        this.activities = tempActivities;
        // console.log(this.activities);
    }
    isFirstInAlphabet(element1, element2) {
        return element1.athlete.last_name.charAt(0) > element1.athlete.last_name.charAt(0);
    }



    print(event) {

        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Print tab</title>
              <style>
              //........Customized style.......
              </style>
            </head>
        <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();

    }

    options: any;


    activitiesList() {

        if (this.custId != undefined) {
            let _self = this;
            let headers = new Headers();
            let currentUser = localStorage.getItem('currentUser');
            headers.append('Authorization', 'Bearer ' + currentUser);
            headers.append('Content-Type', 'application/json');
            Helpers.setLoading(true);
            return _self._http.get(this._root.root_url + '/activities/' + this.custId, { headers: headers })
                .subscribe((res: Response) => {
                    this.pre_activity = res.json();
                    if (this.pre_activity.sport_id != "2db60763-4366-4821-9632-3fb0c7951e4a") {
                        this.pre_activity.water_temperature = null;
                    }
                    if (this.pre_activity.sport_id == "2db60763-4366-4821-9632-3fb0c7951e4a") {
                        this.swimming = true;
                    }
                    else {
                        this.swimming = false;
                        // this.pre_activity.water_temperature = null;
                    }
                    Helpers.setLoading(false);
                    //console.log(this.pre_activity);
                    //this.datatable = (<any>$('.m_datatable')).mDatatable(this.options);
                    localStorage.setItem('preActivityID', this.custId);
                    let IntialTempObj = this.pre_activity;
                    localStorage.setItem('key1', JSON.stringify(IntialTempObj));
                    this.initCheck = true;

                    // this.pre_activity=res.json;
                }, error => {
                    Helpers.setLoading(false);
                });

        }

    }
    initCheckAthletes;
    listOfAthletes() {
        let headers = new Headers();
        let currentUser = localStorage.getItem('currentUser');
        headers.append('Authorization', 'Bearer ' + currentUser);
        headers.append('Content-Type', 'application/json');
        Helpers.setLoading(true);
        return this._http.get(this._root.root_url + '/athletes/', { headers: headers })
            .subscribe((res: Response) => {
                Helpers.setLoading(false);
                this.data = res.json();
                this.isUpdateAthlete = false;
                // let IntialTempObjAthletes = this.data;
                // localStorage.setItem('keyAthletes1', JSON.stringify(IntialTempObjAthletes));
                // this.initCheckAthletes = true;
            }, error => {
                Helpers.setLoading(false);
            });

    }


}





