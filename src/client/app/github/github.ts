import {AngularFire} from 'angularfire2';
import {Inject, Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ScalarObservable} from 'rxjs/observable/ScalarObservable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

import {User, Repo} from './types';
import {LOCAL_STORAGE} from '../config';

const GITHUB_API = 'https://api.github.com';

interface LocalStorage {
  getItem(key:string): string;
  setItem(key:string, value:string): void;
}

@Injectable()
export class Github {

  constructor(
    private _http:Http,
    @Inject(LOCAL_STORAGE) private _localStorage:LocalStorage,
    private _af:AngularFire) {}

  // TODO(jeffbcross): don't use error paths here
  fetch(path:string, params?: string): Observable<Repo[]> {
    return this._getCache(path)
      .catch(() => this._af.auth
        .map((auth:any) => auth.github.accessToken)
        .mergeMap((tokenValue) => this._httpRequest(path, tokenValue, params)));
  }

  _httpRequest (path:string, accessToken:string, params?:string) {
    var url = `${GITHUB_API}${path}?${params ? params + '&' : ''}access_token=${accessToken}`;
    return this._http.get(url)
      // Set the http response to cache
      // TODO(jeffbcross): issues should be cached in more structured and queryable format
      .do(res => this._setCache(path, res.text()))
      // Get the JSON object from the response
      .map(res => res.json());
  }

  /**
   * TODO(jeffbcross): get rid of this for a more sophisticated, queryable cache
   */
  _getCache (path:string): Observable<Repo[]> {
    var cacheKey = `izCache${path}`;
    var cache = this._localStorage.getItem(cacheKey);
    if (cache) {
      return ScalarObservable.create(JSON.parse(cache));
    } else {
      return ErrorObservable.create(null);
    }
  }

  /**
   * TODO(jeffbcross): get rid of this for a more sophisticated, queryable cache
   */
  _setCache(path:string, value:string): void {
    var cacheKey = `izCache${path}`;
    this._localStorage.setItem(cacheKey, value);
  }
}
