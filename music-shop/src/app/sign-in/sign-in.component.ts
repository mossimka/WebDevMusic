import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {SignUpComponent} from '../sign-up/sign-up.component';

import {AuthModel} from '../interfaces/authModel';
import {FormsModule} from '@angular/forms';
import {UserService} from '../services/user.service';
import {Token} from '../interfaces/token';

@Component({
  selector: 'app-sign-in',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  authModel: AuthModel;

  protected readonly SignUpComponent = SignUpComponent;

  constructor(private userService: UserService) {
    this.authModel = {} as AuthModel;
  }

  login() {
    this.userService.login(this.authModel).subscribe((token: Token) => {
      console.log(token.access);
      console.log(token.refresh);
    })
  }
}
