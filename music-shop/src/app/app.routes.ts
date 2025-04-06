import { Routes } from "@angular/router";
import { ContentComponent } from "./content/content.component";
import { DetailsComponent } from "./details/details.component";
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {FavoriteComponent} from './favorite/favorite.component';
import {CartComponent} from './cart/cart.component';
import {OrdersComponent} from './orders/orders.component';

export const routes: Routes = [
    {
        path: '',
        component: ContentComponent,
        title: 'Home Page'
    },
    {
        path: 'details/:id',
        component: DetailsComponent,
        title: 'Details Page'
    },
    {
      path: 'sign-in',
      component: SignInComponent,
      title: 'Sign-In Page'
    },
    {
      path: 'sign-up',
      component: SignUpComponent,
      title: 'Sign-Up Page'
    },
    {
      path: 'favorite',
      component: FavoriteComponent,
      title: 'Favorite Page'
    },
    {
      path: 'cart',
      component: CartComponent,
      title: 'Cart Page'
    },
    {
      path: 'orders',
      component: OrdersComponent,
      title: 'Orders Page'
    }
];
