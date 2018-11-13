import { NgModule } from '@angular/core';
import { ReportsComponent } from './reports.component';
import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from "../auth/_guards/auth.guard";
const routes: Routes = [
    {
        "path": "",
        "component": ReportsComponent,
        "children": [
            {
                "path": "activity-table",
                "loadChildren": ".\/activity-datatable\/activity-datatable.module#ActivityDatatableModule"
            },
            {
                "path": "activity-summary-statistics",
                "loadChildren": ".\/activity-summary-statistics\/activity-summary-statistics.module#ActivitySummaryStatisticsModule"
            },
            {
                "path": "",
                "redirectTo": "activity-table",
                "pathMatch": "full"
            }
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})
export class ReportsRoutingModule { }