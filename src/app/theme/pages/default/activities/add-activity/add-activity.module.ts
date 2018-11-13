import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddActivityComponent } from './add-activity.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { FormsModule } from '@angular/forms';
import { BackHighlightDirective } from './directives/back-highlight.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { TwoDigitDecimaNumberDirective } from './directives/two-digit-decima-number.directive';
import { AmazingTimePickerModule } from 'amazing-time-picker';
// import { NouisliderModule } from 'ng2-nouislider';
import { DataTableModule } from "angular2-datatable";
import { Utils } from '../../utils/utile.service';
import { NgxMaskModule } from 'ngx-mask'
// import { InputMaskModule } from 'ng2-inputmask';
// import { DataTableModule } from "ng2-data-table";

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": AddActivityComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, DataTableModule,
        RouterModule.forChild(routes),
        LayoutModule,
        FormsModule,
        AmazingTimePickerModule,
        // NouisliderModule,
        NgxMaskModule.forRoot()
        // InputMaskModule
        // DataTableModule
    ], exports: [
        RouterModule,
        FormsModule
    ], declarations: [
        AddActivityComponent,
        BackHighlightDirective,
        HighlightDirective,
        TwoDigitDecimaNumberDirective
    ],
    providers: [Utils]
})
export class AddActivityModule {
}
