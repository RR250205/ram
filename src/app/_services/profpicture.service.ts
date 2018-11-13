import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ProfpictureService {

    constructor(private _http: Http) { }

    public uploadImage(formData: any) {
        let currentUser = localStorage.getItem('currentUser');
        let headers = new Headers();
        headers.append('Authorization', currentUser);
        headers.append('Accept', 'application/json');
        let myParams = new URLSearchParams();
        myParams.append('id', formData);
        console.log(formData.id)
        let options = new RequestOptions({ headers: headers, params: myParams });
        console.log(options);
        return this._http.post('/user/uploadProfileImage', formData, options)
            .catch(this._errorHandler);
    }
    private _errorHandler(error: Response) {
        console.log('Error occured: ' + error);
        return Observable.throw(error || 'Some Error Occured');
    }


}
