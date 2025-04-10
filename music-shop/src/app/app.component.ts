import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'music-shop';
  logged_in = false;
  isPopupVisible = false;
  private loggedInSubscription: Subscription | undefined;

  constructor(private userService: UserService, private router: Router) {} // Changed to UserService

  ngOnInit() {
    this.loggedInSubscription = this.userService.loggedIn$.subscribe(
      (loggedIn:boolean) => {
        this.logged_in = loggedIn;
      }
    );
  }

  ngOnDestroy() {
    if (this.loggedInSubscription) {
      this.loggedInSubscription.unsubscribe();
    }
  }

  sign_out() {
    this.userService.logout(); // Changed to UserService
  }

  popUp() {
    this.isPopupVisible = !this.isPopupVisible;
  }
}
