import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SweatrateAnalysisComponent } from './sweatrate-analysis.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { DataTableModule } from "angular2-datatable";


const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": SweatrateAnalysisComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        DataTableModule,
        CommonModule,
        RouterModule.forChild(routes),
        LayoutModule,
    ], exports: [
        RouterModule,
    ], declarations: [
        SweatrateAnalysisComponent,
    ]
})
export class SweatrateAnalysisModule {
}
