import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';

@Component({
    selector: 'app-logo-nav',
    templateUrl: './logo-nav.component.html',
    styleUrls: ['./logo-nav.component.css'],
})
export class LogoNavComponent implements OnInit {
    currentUserName: any = localStorage.getItem('userName');
    profileImage: any = localStorage.getItem('profileImage');

    constructor() {
        // console.log(this.profileImage);
    }

    ngOnInit() {
    }

}
