import {
  beforeEachProviders,
  it,
  iit,
  describe,
  ddescribe,
  inject,
  injectAsync
} from 'angular2/testing';
import {provide} from 'angular2/core';
import 'rxjs/add/operator/take';

import {
  Criteria,
  FilterStore,
  Filter,
  FilterObject,
  generateQuery,
  retrieveFromCache,
  updateCache,
  UnlabeledCriteria,
  LOCAL_STORAGE_KEY,
  LabelCriteria
} from './filter-store.service';
import {LOCAL_STORAGE} from './config';
import {MockLocalStorage} from './testing/mocks';

describe('FilterStore Service', () => {

  beforeEachProviders(() => [FilterStore, provide(LOCAL_STORAGE, {
    useClass: MockLocalStorage
  })]);

  it('should create a filter automatically', inject([FilterStore], (service: FilterStore) => {
    var subscription = service.getFilter('random/repo')
      .changes.subscribe(f => expect(f.repo).toBe('random/repo'));
    subscription.unsubscribe();
  }));


  it('should automatically cache filter changes', inject([FilterStore, LOCAL_STORAGE], (service:FilterStore, localStorage) => {
    var filter = service.getFilter('cache/remove');

    expect(JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_KEY}:cache/remove`))).toEqual({repo: 'cache/remove', criteria: [UnlabeledCriteria]});
    filter.removeCriteria(0);
    expect(JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_KEY}:cache/remove`))).toEqual({repo: 'cache/remove', criteria: []});
  }));


  describe('addCriteria', () => {
    it('should emit the added criteria', inject([LOCAL_STORAGE], (localStorage) => {
      var fooCriteria:Criteria = {
        type: 'foobar',
        name: 'FooCriteria',
        query: 'foo:bar'
      };
      var valueSpy = jasmine.createSpy('value');
      var f = new Filter(localStorage, 'some/repo');
      f.setStorage(localStorage);
      f.changes.subscribe(valueSpy);
      expect(valueSpy).toHaveBeenCalledWith({
        repo: 'some/repo',
        criteria: [UnlabeledCriteria]
      });
      f.addCriteria(fooCriteria);
      expect(valueSpy).toHaveBeenCalledWith({
        repo: 'some/repo',
        criteria: [UnlabeledCriteria, fooCriteria]
      });
    }));


    it('should remove the NO label criteria if adding a HAS label', inject([LOCAL_STORAGE], (localStorage) => {
      var f = new Filter(localStorage, 'label/repo');
      var labelCriteria = Object.assign({}, LabelCriteria, {
        label: 'untriaged'
      });
      f.addCriteria(labelCriteria);
      expect(f.changes.value.criteria.length).toBe(1);
      expect(f.changes.value.criteria[0]).toBe(labelCriteria);
    }));


    it('should remove all HAS label criteria if adding a NO label', inject([LOCAL_STORAGE], (localStorage) => {
      var labelCriteria = Object.assign({}, LabelCriteria, {
        label: 'untriaged'
      });
      var f = new Filter(localStorage, 'label/repo', [labelCriteria]);

      f.addCriteria(UnlabeledCriteria);
      expect(f.changes.value.criteria.length).toBe(1);
      expect(f.changes.value.criteria[0]).toBe(UnlabeledCriteria);
    }));
  });


  describe('updateCriteria', () => {
    it('should update the criteria', inject([LOCAL_STORAGE], (localStorage) => {
      var fooCriteria:Criteria = {
        type: 'foobar',
        name: 'FooCriteria',
        query: 'foo:bar'
      };
      var valueSpy = jasmine.createSpy('value');
      var f = new Filter(localStorage, 'some/repo');
      f.setStorage(localStorage)
      f.changes.subscribe(valueSpy);
      expect(valueSpy).toHaveBeenCalledWith({
        repo: 'some/repo',
        criteria: [UnlabeledCriteria]
      });
      f.updateCriteria(0, fooCriteria);
      expect(valueSpy).toHaveBeenCalledWith({
        repo: 'some/repo',
        criteria: [fooCriteria]
      });
    }));
  });


  describe('generateQuery()', () => {
    it('should generate query arguments based on passed in criteria', () => {
      expect(generateQuery({repo: 'fake/repo', criteria: [UnlabeledCriteria]})).toBe('no:label+repo:fake/repo');
    });

    it('should serialize LabelCriteria', () => {
      expect(generateQuery({repo: 'fake/repo', criteria: [Object.assign({}, LabelCriteria, {
        label: 'High Priority'
      })]})).toBe('label:"High+Priority"+repo:fake/repo')
    });

    it('should correctly parse this label', () => {
      expect(generateQuery({
        repo: 'fake/repo',
        criteria: [Object.assign({}, LabelCriteria, {
          label: '[Angular 2] other module problems'
        })]
      })).toBe('label:"%5BAngular+2%5D+other+module+problems"+repo:fake/repo');
    });
  });


  describe('retrieveFromCache()', () => {
    it('should return null if does not exist', inject([LOCAL_STORAGE], (localStorage) => {
      expect(retrieveFromCache('foo/bar', localStorage)).toBe(null);
    }));


    it('should retrieve a filter from cache and return it as a Filter', inject([LOCAL_STORAGE], (localStorage) => {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}:none/repo`, JSON.stringify({criteria: [], repo: 'none/repo'}));
      retrieveFromCache('none/repo', localStorage).changes.subscribe((f:FilterObject) => {
        expect(f.repo).toBe('none/repo');
      });
    }));
  });


  describe('retrieveFromCache()', () => {
    it('should return null if does not exist', inject([LOCAL_STORAGE], (localStorage) => {
      updateCache('foo/bar', {repo: 'foo/bar', criteria: []}, localStorage);
      expect(JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_KEY}:foo/bar`)))
        .toEqual({repo: 'foo/bar', criteria: []});
    }));
  });
});
