import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [
    RouterLink,
    FormsModule
  ],
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  user = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:8000/api/sign-up/', this.user).subscribe({
      next: response => {
        console.log('Signup successful', response);
        alert('User created successfully!');
      },
      error: err => {
        console.error('Signup failed', err);
        alert('Signup failed!');
      }
    });
    this.router.navigate(['/']);
  }
}
