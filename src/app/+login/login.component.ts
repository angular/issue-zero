import { Component, OnInit } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { CanActivate } from '@angular/router-deprecated';
import { AngularFire } from 'angularfire2';

import { FB_URL } from '../shared/config';

@Component({
  moduleId: module.id,
  styles: [`
    button[md-raised-button] {
      margin: 8px;
    }
    h3.headline {
      margin: 8px;
      font-size: 24px;
      line-height: 32px;
    }

    [md-raised-button][color=primary] {
      background-color: rgb(33, 150, 243);
    }
      `],
      template: `
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
      directives: [MdButton]
})
// If not a login redirect, and no existing auth state
@CanActivate(() => !(<any>window).__IS_POST_LOGIN && !(new Firebase(FB_URL).getAuth()))
export class LoginComponent {
  constructor(public af: AngularFire) {}
}
