import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {SignUpComponent} from '../sign-up/sign-up.component';

@Component({
  selector: 'app-sign-in',
  imports: [
    RouterLink
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  protected readonly SignUpComponent = SignUpComponent;
}
