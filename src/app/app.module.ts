import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ThemeComponent } from './theme/theme.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from './theme/layouts/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './theme/theme.module';
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { UrlHandlerService } from './_services/url-handler.service';
import { ToastrService } from './_services/toastr.service';
import { ProfpictureService } from './_services/profpicture.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthModule } from "./auth/auth.module";

@NgModule({
    declarations: [
        ThemeComponent,
        AppComponent,
    ],
    imports: [
        LayoutModule,
        BrowserModule,
        ImageCropperModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeRoutingModule,
        ThemeModule,
        AuthModule,
        FormsModule,
    ],
    providers: [ScriptLoaderService, UrlHandlerService, ProfpictureService, ToastrService, CookieService],
    bootstrap: [AppComponent]
})
export class AppModule { }