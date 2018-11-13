import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AddAthleteComponent } from './add-athlete.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": AddAthleteComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ImageCropperModule
    ], exports: [
        RouterModule, ImageCropperModule
    ], declarations: [
        AddAthleteComponent
    ]
})
export class AddAthleteModule {
}
