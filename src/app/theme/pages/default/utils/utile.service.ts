import { Injectable } from '@angular/core';
import { isEqual, differenceWith } from 'lodash';

@Injectable()
export class Utils {

    public getChanges(orginalCollection: any, changedCollection: any): any {
        return differenceWith(changedCollection, orginalCollection, isEqual);
    }
}