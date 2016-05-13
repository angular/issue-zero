import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'issue-zero-app',
  template: `
  <h1>
    {{title}}
  </h1>
  `,
  styles: []
})
export class IssueZeroAppComponent {
  title = 'issue-zero works!';
}
