import { Injectable } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";

@Injectable()
export class UrlHandlerService {
    // public root_url: string = 'http://sweatrater.net:3000';
    // public root_url: string = 'http://52.234.129.145:3000';
    // public root_url: string = 'http://localhost:3000';
    // public root_url: string = 'https://api.sweatrater.net';
    public root_url: string = 'https://staging-api.sweatrater.net';
    constructor() {
    }
}