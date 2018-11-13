import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DefaultModule } from './pages/default/default.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DefaultModule,
    ],
    declarations: [],
})
export class ThemeModule { }
