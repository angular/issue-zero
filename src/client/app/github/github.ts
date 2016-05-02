import {AngularFire, FirebaseAuthState} from 'angularfire2';
import {Inject, Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ScalarObservable} from 'rxjs/observable/ScalarObservable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

import {User, Issue, Repo, Label} from './types';
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
        .filter(auth => auth !== null && auth.github)
        .map((auth:any) => auth.github.accessToken)
        .mergeMap((tokenValue) => this._httpRequest(path, tokenValue, params)));
  }

  getRepo(repoFullName:string): Observable<Repo> {
    // TODO(jeffbcross): check cache first
    return this._af.auth
      .filter(auth => auth !== null && auth.github)
      .map((auth:FirebaseAuthState) => `${GITHUB_API}/repos/${repoFullName}?access_token=${auth.github.accessToken}`)
      .switchMap((url:string) => this._http.get(url).map((res) => res.json()));
  }

  getIssues(query:string):Observable<Issue[]> {
    return this._af.auth
      .filter(auth => auth !== null && auth.github)
      .map((auth:FirebaseAuthState) => `${GITHUB_API}/search/issues?q=${query}&access_token=${auth.github.accessToken}`)
      .switchMap((url:string) => this._http.get(url).map(res => res.json().items))
        .map((issues:Issue[]) => issues
          .map((issue:Issue) => {
            var [url, org, repo, num] = /\/([a-z0-9\-]*)\/([a-z0-9\-]*)\/issues\/([0-9]*)$/i.exec(issue.url);
            return Object.assign({}, issue, {org, repo});
          }))
  }

  closeIssue(issue:Issue): Observable<any> {
    var [url, org, repo, number] = /\/([a-z0-9\-]*)\/([a-z0-9\-]*)\/issues\/([0-9]*)$/.exec(issue.url);
    return this._af.auth
      .filter(auth => auth !== null && auth.github)
      .map((auth:FirebaseAuthState) => `${GITHUB_API}/repos/${org}/${repo}/issues/${number}?access_token=${auth.github.accessToken}`)
      .switchMap((url:string) => this._http.patch(url, JSON.stringify({
        state: 'closed'
      }))
        .map(res => res.json()));
  }

  fetchLabels(repo:string): Observable<Label[]> {
    return this._af.auth
      .filter(auth => auth !== null && auth.github)
      .map((auth:FirebaseAuthState) => `${GITHUB_API}/repos/${repo}/labels?access_token=${auth.github.accessToken}`)
      .switchMap((url:string) => this._http.get(url)
        .map(res => res.json()));
  }

  _httpRequest (path:string, accessToken:string, params?:string) {
    var url = `${GITHUB_API}${path}?${params ? params + '&' : ''}access_token=${accessToken}`;
    return this._http.get(url)
      // Set the http response to cache
      // TODO(jeffbcross): issues should be cached in more structured and queryable format
      // Get the JSON object from the response
      .map(res => res.json())
      .flatMap(res => {
        this._setCache(path, res.text());
        return Observable.fromPromise(Promise.resolve(res));
      });

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
