import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Changed to UserService
import { Token } from '../interfaces/token';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  authModel: any = {};

  constructor(private userService: UserService, private router: Router) {} // Changed to UserService

  login() {
    this.userService.login(this.authModel).subscribe(() => { // Changed to UserService
      this.router.navigate(['/']);
    });
  }
}
