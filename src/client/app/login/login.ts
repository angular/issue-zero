import {Component} from 'angular2/core';
import {AngularFire} from 'angularfire2';
import {MdButton} from '@angular2-material/button';

@Component({
  styleUrls: ['app/login/login.css'],
  templateUrl: 'app/login/login.html',
  directives: [MdButton]
})
export class LoginComponent {
  constructor(public af:AngularFire) {}
}
