declare var jasmine:any;
declare var expect:any;
import {
  it,
  iit,
  describe,
  ddescribe,
  // expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEach,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {AngularFire, FIREBASE_PROVIDERS, defaultFirebase} from 'angularfire2';
import {Github} from './github';
import {HTTP_PROVIDERS, XHRBackend, Response, BaseResponseOptions} from 'angular2/http';
import {MockBackend, MockConnection} from 'angular2/http/testing';
import {LOCAL_STORAGE} from '../config';
import {ScalarObservable} from 'rxjs/observable/ScalarObservable';
import {MockLocalStorage} from '../testing/mocks';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

describe('Github Service', () => {

  beforeEachProviders(() => [
    Github,
    FIREBASE_PROVIDERS,
    defaultFirebase('https://issue-zero.firebaseio.com'),
    HTTP_PROVIDERS,
    provide(XHRBackend, {
      useClass: MockBackend
    }),
    provide(LOCAL_STORAGE, {
      useClass: MockLocalStorage
    })]);

  beforeEach(inject([AngularFire], (angularFire) => {
    angularFire.auth = new ScalarObservable({github: {
      accessToken: 'fooAccessToken'
    }})
  }));


  it('should make a request to the Github API', inject([Github, XHRBackend], (service: Github, backend: MockBackend) => {
    var nextSpy = jasmine.createSpy('next')
    backend.connections.subscribe(nextSpy);

    var fetchObservable = service.fetch('/repo', 'bar=baz');
    expect(nextSpy).not.toHaveBeenCalled();
    fetchObservable.subscribe();
    expect(nextSpy).toHaveBeenCalled();
  }));


  it('should not make a request to the Github API if value exists in cache', inject(
      [Github, XHRBackend, LOCAL_STORAGE],
      (service: Github, backend: MockBackend, localStorage) => {
        var connectionCreated = jasmine.createSpy('connectionCreated');
        var valueReceived = jasmine.createSpy('valueReceived');
        backend.connections.subscribe(connectionCreated);

        localStorage.setItem('izCache/repo', '{"issues": ["1"]}');

        var fetchObservable = service.fetch('/repo', 'bar=baz');
        expect(connectionCreated).not.toHaveBeenCalled();
        fetchObservable.subscribe(valueReceived);
        expect(connectionCreated).not.toHaveBeenCalled();
        expect(valueReceived.calls.argsFor(0)[0]).toEqual({issues: ['1']})
      }));

  it('should set http response json to cache', inject(
      [Github, XHRBackend, LOCAL_STORAGE],
      (service: Github, backend: MockBackend, localStorage) => {
        var setItemSpy = spyOn(localStorage, 'setItem');
        backend.connections.subscribe((c:MockConnection) => {
          c.mockRespond(new Response(new BaseResponseOptions().merge({body: `{"issues": ["1","2","3"]}`})));
        });

        var fetchObservable = service.fetch('/repo', 'bar=baz');
        fetchObservable.subscribe();
        expect(setItemSpy).toHaveBeenCalledWith('izCache/repo', '{"issues": ["1","2","3"]}');
      }));
});
