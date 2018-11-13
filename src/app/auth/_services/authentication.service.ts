import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { UrlHandlerService } from '../../_services/url-handler.service';
import { Router } from "@angular/router";
import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {


    constructor(private http: Http,
        private router: Router,
        private _root: UrlHandlerService) {
    }

    login(email: string, password: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this._root.root_url + '/users/login', JSON.stringify({ email: email, password: password }), { headers: headers })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                // console.log(response);
                let resSTR = JSON.stringify(response);
                let resJSON = JSON.parse(resSTR);
                let body = JSON.parse(resJSON._body);
                let token = body.auth_token;
                let users = body.user;
                let username = users.first_name;
                let userRole = users.is_admin;
                let unitID = users.unit_id;
                let profileImage = users.profile_picture;
                localStorage.setItem('userName', username);
                localStorage.setItem('userRole', userRole);
                localStorage.setItem('preferedUnit', unitID);
                localStorage.setItem('profileImage', profileImage);
                // console.log("Your Token: " + token);
                if (response.status == 200) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    // console.log('Here we save some user info');
                    localStorage.setItem('currentUser', token);
                    let local = localStorage.getItem('currentUser');
                    return true;
                }
                if (response.status === 401) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    // console.log('Not a Valid Token');
                    return false;
                }
            });
    }

    // signup(form: any){
    //     return this.http.post('/users/signup', JSON.stringify({}))
    //     .map((response: Response) => {
    //         console.log(response);
    //     });
    // }
    logout() {
        // remove user from local storage to log user out
        // localStorage.removeItem('currentUser');
        // localStorage.removeItem('userName');
        // localStorage.removeItem('userRole');
        localStorage.clear();
    }
}