import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";
const routes: Routes = [
    {
        "path": "",
        "component": ThemeComponent,
        "canActivate": [AuthGuard],
        "children": [
            {
                "path": "index",
                "loadChildren": ".\/pages\/default\/index\/index.module#IndexModule"
            },
            { // Users Related Paths
                "path": "user-management",
                "loadChildren": ".\/pages\/default\/users\/usermanagement\/usermanagement.module#UsermanagementModule"
            },
            {
                "path": "invite-user",
                "loadChildren": ".\/pages\/default\/users\/inviteuser\/inviteuser.module#InviteuserModule"
            },
            {
                "path": "update-user",
                "loadChildren": ".\/pages\/default\/users\/update-user\/update-user.module#UpdateUserModule"
            },
            {
                "path": "testing",
                "loadChildren": ".\/pages\/default\/testing\/testing.module#TestingModule"
            },
            {
                "path": "refresh",
                "loadChildren": ".\/pages\/default\/users\/refresh\/refresh.module#RefreshModule"
            },
            {
                "path": "refresh-user-management",
                "loadChildren": ".\/pages\/default\/users\/refresh-user-management\/refresh-user-management.module#RefreshUserManagementModule"
            },
            { // Athletes Related Paths
                "path": "athlete-management",
                "loadChildren": ".\/pages\/default\/athletes\/athlete-management\/athlete-management.module#AthleteManagementModule"
            },
            {
                "path": "add-athlete",
                "loadChildren": ".\/pages\/default\/athletes\/add-athlete\/add-athlete.module#AddAthleteModule"
            },
            {
                "path": "refresh-athlete",
                "loadChildren": ".\/pages\/default\/athletes\/refresh-athlete\/refresh-athlete.module#RefreshAthleteModule"
            },
            {
                'path': 'edit-athlete/:id',
                "loadChildren": ".\/pages\/default\/athletes\/edit-athlete\/edit-athlete.module#EditAthleteModule"
            },
            {
                "path": "refresh-athlete-management",
                "loadChildren": ".\/pages\/default\/athletes\/refresh-athlete-management\/refresh-athlete-management.module#RefreshAthleteManagementModule"
            },
            { // Activity Related Paths
                "path": "activity-management",
                "loadChildren": ".\/pages\/default\/activities\/activity-management\/activity-management.module#ActivityManagementModule"
            },
            {
                "path": "add-activity",
                "loadChildren": ".\/pages\/default\/activities\/add-activity\/add-activity.module#AddActivityModule"
            },
            {
                "path": "add-activity\/:custId",
                "loadChildren": ".\/pages\/default\/activities\/add-activity\/add-activity.module#AddActivityModule"
            },
            {
                "path": "refresh-activity-management",
                "loadChildren": ".\/pages\/default\/activities\/refresh-activity-management\/refresh-activity-management.module#RefreshActivityManagementModule"
            },
            {
                "path": "refresh-activity",
                "loadChildren": ".\/pages\/default\/activities\/refresh-activity\/refresh-activity.module#RefreshActivityModule"
            },
            {
                "path": "refresh-athletes",
                "loadChildren": ".\/pages\/default\/activities\/refresh-athletes\/refresh-athletes.module#RefreshAthletesModule"
            },
            { // Sports Related Paths
                "path": "sport-management",
                "loadChildren": ".\/pages\/default\/sports\/sport-management\/sport-management.module#SportManagementModule"
            },
            {
                "path": "add-sport",
                "loadChildren": ".\/pages\/default\/sports\/add-sport\/add-sport.module#AddSportModule"
            },
            {
                "path": "refresh-sport-management",
                "loadChildren": ".\/pages\/default\/sports\/refresh-sport-management\/refresh-sport-management.module#RefreshSportManagementModule"
            },
            {
                'path': 'edit-sport/:id',
                "loadChildren": ".\/pages\/default\/sports\/edit-sport\/edit-sport.module#EditSportModule"
            },
            {
                "path": "refresh-sport",
                "loadChildren": ".\/pages\/default\/sports\/refresh-sport\/refresh-sport.module#RefreshSportModule"
            },
            { // Report Related Paths
                "path": "reports-table",
                "loadChildren": ".\/pages\/default\/reports\/reports.module#ReportsModule"
            },
            {
                "path": "reports-activity",
                "loadChildren": ".\/pages\/default\/reports\/activity-datatable\/activity-datatable.module#ActivityDatatableModule"
            },
            {
                "path": "reports-sweatrate",
                "loadChildren": ".\/pages\/default\/reports\/sweatrate-analysis\/sweatrate-analysis.module#SweatrateAnalysisModule"
            },
            {
                "path": "reports-coverage",
                "loadChildren": ".\/pages\/default\/reports\/activity-summary-statistics\/activity-summary-statistics.module#ActivitySummaryStatisticsModule"
            },
            {
                "path": "refresh-report",
                "loadChildren": ".\/pages\/default\/reports\/refresh-report\/refresh-report.module#RefreshReportModule"
            },
            {
                "path": "refresh-report-management",
                "loadChildren": ".\/pages\/default\/reports\/refresh-report-management\/refresh-report-management.module#RefreshReportManagementModule"
            },
            {
                "path": "404",
                "loadChildren": ".\/pages\/default\/not-found\/not-found.module#NotFoundModule"
            },
            {
                "path": "",
                "redirectTo": "index",
                "pathMatch": "full"
            }
        ]
    },


    {
        "path": "snippets\/pages\/user\/login-1",
        "loadChildren": ".\/pages\/self-layout-blank\/snippets\/pages\/user\/user-login-1\/user-login-1.module#UserLogin1Module"
    },
    {
        "path": "**",
        "redirectTo": "404",
        "pathMatch": "full"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})
export class ThemeRoutingModule { }