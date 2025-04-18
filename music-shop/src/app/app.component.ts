import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import {User} from './interfaces/user';
import {RoutingButtonComponent} from './Buttons/routing-button/routing-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, RoutingButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'music-shop';
  logged_in = false;
  isPopupVisible = false;
  private loggedInSubscription: Subscription | undefined;

  user: User | null = null;
  authService: AuthService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((data) => {
        this.user = data;
    });
    this.loggedInSubscription = this.authService.loggedIn$.subscribe(
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
    this.authService.logout();
  }

  popUp() {
    this.isPopupVisible = !this.isPopupVisible;
  }
}
