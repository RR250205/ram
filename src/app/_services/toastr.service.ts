import { Injectable } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
declare var toastr: any;
@Injectable()
export class ToastrService {
    constructor() {
    }
    Success(message: string, title?: string) {
        toastr.success(message, title);
    }
    Warning(message: string, title?: string) {
        toastr.warning(message, title);
    }
    Error(message: string, title?: string) {
        toastr.error(message, title);
    }
    Info(message: string, title?: string) {
        toastr.info(message, title);
    }
}