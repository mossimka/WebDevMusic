import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Changed to AuthService
import { Token } from '../../interfaces/token';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  authModel: any = {};

  constructor(private userService: AuthService, private router: Router) {} // Changed to AuthService

  login() {
    this.userService.login(this.authModel).subscribe(() => { // Changed to AuthService
      this.router.navigate(['/']);
    });
  }
}
