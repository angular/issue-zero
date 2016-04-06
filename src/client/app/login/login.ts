import {Component} from 'angular2/core';
import {AngularFire} from 'angularfire2';
import {MdButton} from '@angular2-material/button';

@Component({
  styles : [ `
button[md-raised-button] {
  margin: 8px;
}
h3.headline {
  margin: 8px;
  font-size: 24px;
  line-height: 32px;
}
  ` ],
  template : `
<div *ngIf="!(af.auth | async)">
  <h3 class="headline">
    Keep your Github issues tidy,<br>
    and your users happy.
  </h3>
  <button md-raised-button color="primary" (click)="af.auth.login()">
    Log in with Github
  </button>
</div>
  `,
  directives : [ MdButton ]
})
export class LoginComponent {
  constructor(public af: AngularFire) {}
}
