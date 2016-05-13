import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RepoSelectorRowComponent } from './repo-selector-row.component';

describe('Component: RepoSelectorRow', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [RepoSelectorRowComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([RepoSelectorRowComponent],
      (component: RepoSelectorRowComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(RepoSelectorRowComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(RepoSelectorRowComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-repo-selector-row></app-repo-selector-row>
  `,
  directives: [RepoSelectorRowComponent]
})
class RepoSelectorRowComponentTestController {
}

